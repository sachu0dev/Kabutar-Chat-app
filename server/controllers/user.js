import { compare } from 'bcrypt';
import { NEW_REQUEST, REFETCH_CHATS } from '../constants/events.js';
import { acceptRequestSchema, loginSchema, searchUserSchema, sendRequestSchema, signUpSchema } from '../lib/validators.js';
import { TryCatch } from '../middlewares/error.js';
import { Chat } from '../models/chat.js';
import { Request } from '../models/request.js';
import { User } from '../models/user.js';
import { emitEvent, sendToken, uploadFilesToCloud } from '../utils/featurns.js';
import { ErrorHandler } from '../utils/utility.js';
import { getOtherMembers } from '../lib/helper.js';

const newUser = TryCatch(async (req, res, next) => {
  const { name, username, password, bio } = req.body;
  const file = req.file;

  if (!file) return next(new ErrorHandler("Please upload a file", 400));

  const result = await uploadFilesToCloud([file]);
  const avatar = {
    public_id: result[0].public_id,
    url: result[0].url
  };



  const isValidInput = signUpSchema.safeParse({ name, username, password, bio,avatar });

  if (!isValidInput.success) {
    const errorMessages = isValidInput.error.issues.map(issue => issue.message).join(", ");
    return next(new ErrorHandler(errorMessages, 400));
  }

  const user = await User.create(isValidInput.data);
  console.log("User created: " + user._id);
  sendToken(res, user, 201, "User created successfully");
});

const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;
  const isValidInput = loginSchema.safeParse({ username, password });

  if (!isValidInput.success) {
    const errorMessages = isValidInput.error.issues.map(issue => issue.message).join(", ");
    return next(new ErrorHandler(errorMessages, 400));
  }

  const user = await User.findOne({ username }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid Username", 404));
  const isMatch = await compare(password, user.password);
  if (!isMatch) return next(new ErrorHandler("Invalid Password", 401));

  sendToken(res, user, 200, `Welcome Back ${user.name}`);
});

const getMyprofile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);
  if (!user) return next(new ErrorHandler("User not found", 404));
  res.status(200).json({ success: true, user });
});

const logout = TryCatch(async (req, res) => {
  res.status(200).cookie("token", null, { expires: new Date(Date.now()), httpOnly: true }).json({
    success: true,
    message: "Logged Out"
  });
});

const searchUser = TryCatch(async (req, res, next) => {
  const { name = '' } = req.query;
  const isValidInput = searchUserSchema.safeParse({ name });

  if (!isValidInput.success) {
    const errorMessages = isValidInput.error.issues.map(issue => issue.message).join(", ");
    return next(new ErrorHandler(errorMessages, 400));
  }

  const myChats = await Chat.find({ groupChat: false, members: req.user });
  const allUserFromChats = myChats.flatMap(chat => chat.members);
  const notFriends = await User.find({
    _id: { $nin: allUserFromChats },
    name: { $regex: name, $options: "i" }
  });

  const users = notFriends.map(({ name, _id, avatar }) => ({
    name,
    _id,
    avatar: avatar.url
  }));

  res.status(200).json({ success: true, users });
});

const sendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;
  const isValidInput = sendRequestSchema.safeParse({ userId });

  if (!isValidInput.success) {
    const errorMessages = isValidInput.error.issues.map(issue => issue.message).join(", ");
    return next(new ErrorHandler(errorMessages, 400));
  }

  const request = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user }
    ]
  });

  if (request) return next(new ErrorHandler("Request already sent", 404));

  await Request.create({ sender: req.user, receiver: userId });
  emitEvent(req, NEW_REQUEST, [userId]);

  res.status(200).json({ success: true, message: "Friend request sent" });
});

const acceptRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;
  const isValidInput = acceptRequestSchema.safeParse({ requestId, accept });

  if (!isValidInput.success) {
    const errorMessages = isValidInput.error.issues.map(issue => issue.message).join(", ");
    return next(new ErrorHandler(errorMessages, 400));
  }

  const request = await Request.findById(requestId).populate("sender", "name").populate("receiver", "name");
  if (!request) return next(new ErrorHandler("Request not found", 404));

  if (request.receiver._id.toString() !== req.user.toString()) {
    return next(new ErrorHandler("You are not authorized to accept this request", 401));
  }

  if (!accept) {
    await Request.deleteOne({ _id: requestId });
    return res.status(200).json({ success: true, message: "Request rejected" });
  }

  const members = [request.sender._id, request.receiver._id];
  const chat = await Chat.findOne({ members });

  if (chat) {
    await Request.deleteOne({ _id: requestId });
    return res.status(200).json({ success: true, message: "Friend request accepted", senderId: request.sender._id });
  }

  await Promise.all([
    Chat.create({ members, name: `${request.sender.name} and ${request.receiver.name}` }),
    Request.deleteOne({ _id: requestId })
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  res.status(200).json({ success: true, message: "Friend request accepted", senderId: request.sender._id });
});

const getAllnotification = TryCatch(async (req, res, next) => {
  const request = await Request.find({ receiver: req.user }).populate("sender", "name avatar");
console.log(request);
  const allRequests = request.map(({ sender, _id }) => ({
    _id,
    sender: {
      name: sender.name,
      _id: sender._id,
      avatar: sender.avatar.url
    }
  }));

  res.status(200).json({ success: true, allRequests });
});

const getAllFriends = TryCatch(async (req, res, next) => {
  const chatId = req.query.chatId;
  const chats = await Chat.find({ members: req.user, groupChat: false }).populate("members", "name avatar");

  const friends = chats.map(({ members }) => {
    const otherUser = getOtherMembers(members, req.user);
    return {
      _id: otherUser._id,
      name: otherUser.name,
      avatar: otherUser.avatar.url
    };
  });

  if (chatId) {
    const chat = await Chat.findById(chatId).populate("members", "name avatar");
    const availableFriends = friends.filter(friend => !chat.members.some(member => member._id.equals(friend._id)));

    return res.status(200).json({ success: true, friends: availableFriends });
  } else {
    return res.status(200).json({ success: true, friends });
  }
});

export {
  acceptRequest,
  getAllnotification,
  getMyprofile,
  login,
  logout,
  newUser,
  searchUser,
  sendRequest,
  getAllFriends
};
