import { ALERT, NEW_MESSAGE, NEW_MESSAGE_ALERT, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMembers } from "../lib/helper.js";
import { addMembersSchema, chatIdSchema, newGroupSchema, removeMembersSchema } from "../lib/validators.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Message } from '../models/message.js';
import { User } from '../models/user.js';
import { deleteFilesFromCloud, emitEvent, uploadFilesToCloud } from "../utils/featurns.js";
import { ErrorHandler } from "../utils/utility.js";

const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  const isValidInput = newGroupSchema.safeParse({ name, members });
  if (!isValidInput.success) {
    const errorMessages = isValidInput.error.issues.map(issue => issue.message).join(", ");
    return next(new ErrorHandler(errorMessages, 400));
  }
  if (members.length < 2) {
    return next(new ErrorHandler("Minimum 2 members are required", 400));
  }

  const allMembers = [...members, req.user];

  await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  emitEvent(req, ALERT, allMembers, `Welcome to ${name} group chat`);
  emitEvent(req, "REFETCH_CHATS", members);

  return res.status(201).json({
    success: true,
    message: "Group Chat created successfully",
  });
});

const getMyChats = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({ members: req.user }).populate("members", "name avatar");

  const transformChats = chats.map(({ _id, name, members, groupChat }) => {
    return {
      _id,
      name: groupChat ? name : getOtherMembers(members, req.user).name,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [getOtherMembers(members, req.user).avatar.url],
      members: members.reduce((prev, curr) => {
        if (curr._id.toString() !== req.user.toString()) {
          prev.push(curr._id);
        }
        return prev;
      }, []),
      groupChat,
    };
  });

  return res.status(200).json({
    success: true,
    chats: transformChats,
  });
});

const getMyGroups = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user,
    groupChat: true,
    creator: req.user,
  }).populate("members", "name avatar");

  const groups = chats.map(({ members, _id, groupChat, name }) => {
    return {
      _id,
      name,
      avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
      groupChat,
    };
  });

  return res.status(200).json({
    success: true,
    groups,
  });
});

const addMembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  const isValidInput = addMembersSchema.safeParse({ name, members });
  if (!isValidInput.success) {
    const errorMessages = isValidInput.error.issues.map(issue => issue.message).join(", ");
    return next(new ErrorHandler(errorMessages, 400));
  }

  const chat = await Chat.findById(chatId);

  if (!members || members.length < 1) return next(new ErrorHandler("Please provide members", 400));

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat) return next(new ErrorHandler("This is not a group chat", 400));

  if (chat.creator.toString() !== req.user.toString()) return next(new ErrorHandler("Only group chat creator can add members", 400));

  const allNewMembersPromise = members.map((id) => User.findById(id, "name"));
  const allNewMembers = await Promise.all(allNewMembersPromise);

  const newMemberIds = allNewMembers.map((member) => member._id.toNEW_MESSAGEString());

  const uniqueNewMembers = allNewMembers.filter((member) => !chat.members.some((existingMember) => existingMember.toString() === member._id.toString()));

  if(uniqueNewMembers.length < 1) return next(new ErrorHandler("All members are already in the group", 400));
  if (chat.members.length + uniqueNewMembers.length > 100) return next(new ErrorHandler("Maximum 100 members are allowed", 400));

  chat.members.push(...uniqueNewMembers.map((member) => member._id));

  await chat.save();

  const allUserNames = uniqueNewMembers.map((member) => member.name).join(",");

  emitEvent(req, ALERT, `${allUserNames} added to group`);
  emitEvent(req, "REFETCH_CHATS", chat.members);

  return res.status(200).json({
    success: true,
    message: `${allUserNames} added to group`,
  });
});

const removeMember = TryCatch(async (req, res, next) => {
  const { chatId, userId } = req.body;

  const isValidInput = removeMembersSchema.safeParse({ chatId, userId });
  if (!isValidInput.success) {
    return next(new ErrorHandler(isValidInput.error.issues[0].message, 400));
  }

  const [chat, userToBeRemoved] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat) return next(NEW_MESSAGE_ALERT, new ErrorHandler("This is not a group chat", 400));

  if (chat.creator.toString() !== req.user.toString()) {
    return next(new ErrorHandler("Only group chat creator can remove members", 400));
  }

  if (chat.members.length <= 3) {
    return next(new ErrorHandler("Group chat must have at least 3 members", 400));
  }
  if (!userToBeRemoved) {
    return next(new ErrorHandler("User to be removed not found", 404));
  }

  if (!chat.members.some((member) => member.toString() === userToBeRemoved._id.toString())) {
    return next(new ErrorHandler("User is not a member of this group chat", 400));
  }

  chat.members = chat.members.filter((member) => member.toString() !== userToBeRemoved._id.toString());
  await chat.save();

  emitEvent(req, ALERT, `${userToBeRemoved.name} removed from group`);
  emitEvent(req, "REFETCH_CHATS", chat.members);

  return res.status(200).json({
    success: true,
    message: `${userToBeRemoved.name} removed from group`,
  });
});


const leaveGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const isValidInput = chatIdSchema.safeParse({ chatId });
  if (!isValidInput.success) {
    return next(new ErrorHandler(isValidInput.error.issues[0].message, 400));
  }

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat) return next(new ErrorHandler("This is not a group chat", 400));

  if (chat.members.length <= 3) {
    return next(new ErrorHandler("Group chat must have at least 3 members", 400));
  }

  if (!chat.members.some((member) => member.toString() === req.user.toString())) {
    return next(new ErrorHandler("User is not a member of this group chat", 400));
  }

  const remainingMembers = chat.members.filter((member) => member.toString() !== req.user.toString());

  if (chat.creator.toString() === req.user.toString()) {
    const newCreator = remainingMembers[Math.floor(Math.random() * remainingMembers.length)];
    chat.creator = newCreator;
  }

  chat.members = remainingMembers;
  const user = await User.findById(req.user, "name");
  await chat.save();

  emitEvent(req, "ALERT", `User ${user.name} has left the group`);
  emitEvent(req, "REFETCH_CHATS", chat.members);

  return res.status(200).json({
    success: true,
    message: `${user.name} has left the group`,
  });
});

const sendAttachment = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;
  const files = req.files || [];
  // console.log(files);

  if (files.length < 1) return next(new ErrorHandler("Please select an attachment", 400));

  if(files.length > 5) return next(new ErrorHandler("You can only send up to 5 attachments at a time", 400));

  const isValidInput = chatIdSchema.safeParse({ chatId });
  if (!isValidInput.success) {
    return next(new ErrorHandler(isValidInput.error.issues[0].message, 400));
  }
  const [chat, user] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user, "name") // Ensure `req.user._id` is used
  ]);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));


  if (files.length < 1) return next(new ErrorHandler("Please select an attachment", 400));

  // Upload files and process attachments
  const attachments = await uploadFilesToCloud(files)

 
  const dbMessage = {
    content: "",
    attachments,
    sender: user._id,
    chat: chatId
  };
  const realTimeMessage = {
    ...dbMessage,
    sender: {
      _id: user._id,
      name: user.name
    }
  };

  const message = await Message.create(dbMessage);

  emitEvent(req, NEW_MESSAGE, chat.members, {
    message: realTimeMessage,
    chatId
  });

  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, {
    chatId
  });

  return res.status(200).json({
    success: true,
    message
  });
});


const getChatDetails = TryCatch(async (req, res, next) => {
  if(req.query.populate) {
    const chat = await Chat.findById(req.params.id).populate("members", "name avatar").lean();

    if(!chat) return next(new ErrorHandler("Chat not found", 404));

    chat.members = chat.members.map((member) => {
      return {
        _id: member._id,
        name: member.name,
        avatar: member.avatar.url
      }
    })

    return res.status(200).json({
      success: true,
      chat
    });
  }
  else{
    const chat = await Chat.findById(req.params.id)

    if(!chat) return next(new ErrorHandler("Chat not found", 404));

    return res.status(200).json({
      success: true,
      chat
    });
  }

   
});

const renameGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { name }= req.body;

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat) return next(new ErrorHandler("This is not a group chat", 400));

  if(chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("Only the group creator can rename the group", 400));

  chat.name = name;

  await chat.save();


  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Group renamed successfully",
  });
});

const deleteChatDetails = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  const members = chat.members;

  if(chat.groupChat && chat.creator.toString() !== req.user.toString()) return next(new ErrorHandler("Only the group creator can delete the group", 400));

  if(!chat.groupChat && !chat.members.includes(req.user)) return next(new ErrorHandler("you are not allowed to delete the chat", 403));

  // here we have detete all messages as well as attachments or files from cloudinary

  const messageWithAttachments = await Message.find({ chat: chatId ,
    attachments: {
      $exists: true, $ne: []
    }
  });
  const public_ids = [];

  messageWithAttachments.forEach(({ attachments }) => {
    attachments.forEach(({ public_id }) => {
      public_ids.push(public_id);
    })
  });
  await Promise.all([
    // Delete files form cloudinary
    deleteFilesFromCloud(public_ids),Chat.deleteOne(),
    Message.deleteMany({ chat: chatId }),

  ]);
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Chat deleted successfully",
  });
});

const getMessages = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { page = 1 } = req.query;

  const limit = 20;
  const skip = (page - 1) * limit;
  const [messages, totalMessages] = await Promise.all([
    Message.find({ chat: chatId }).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("sender", "name")
    .lean(),
    Message.countDocuments({ chat: chatId }),
  ])

  const totalPages = Math.ceil(totalMessages / limit);

  return res.status(200).json({
    success: true,
    messages: messages.reverse(),
    totalPages
  });
})

export { addMembers, deleteChatDetails, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMember, renameGroup, sendAttachment };

