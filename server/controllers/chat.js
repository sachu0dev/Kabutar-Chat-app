import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.js";
import { emitEvent } from "../utils/featurns.js";
import { ALERT } from "../constants/events.js";
import { getOtherMembers } from "../lib/helper.js";
import { User } from '../models/user.js';

const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

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

  const chat = await Chat.findById(chatId);

  if (!members || members.length < 1) return next(new ErrorHandler("Please provide members", 400));

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat) return next(new ErrorHandler("This is not a group chat", 400));

  if (chat.creator.toString() !== req.user.toString()) return next(new ErrorHandler("Only group chat creator can add members", 400));

  const allNewMembersPromise = members.map((id) => User.findById(id, "name"));
  const allNewMembers = await Promise.all(allNewMembersPromise);

  const newMemberIds = allNewMembers.map((member) => member._id.toString());

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


  const [chat, userToBeRemoved] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat) return next(new ErrorHandler("This is not a group chat", 400));

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




export { newGroupChat, getMyChats, getMyGroups, addMembers , removeMember, leaveGroup };
