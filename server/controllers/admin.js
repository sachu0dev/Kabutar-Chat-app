import { adminLoginSchema } from "../lib/validators.js";
import { TryCatch } from "../middlewares/error.js"
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import  jwt  from 'jsonwebtoken';
import { cookieOptions } from "../utils/featurns.js";
import { ErrorHandler } from "../utils/utility.js";



const adminLogin = TryCatch(async (req, res, next) => {
  const {secretKey} = req.body;

  const isValidInput = adminLoginSchema.safeParse({ secretKey });
  if (!isValidInput.success) {
    return next(new ErrorHandler(isValidInput.error.issues[0].message, 400));
  }

  const isMatch = secretKey === process.env.SECRET_KEY;
  if (!isMatch) {
    return next(new ErrorHandler("Invalid Admin key", 401));
  }

  const token = jwt.sign(secretKey, process.env.SECRET_KEY);

  res.status(200).cookie("admin-token", token, {...cookieOptions, maxAge: 1000 * 60 * 15}).json({
    success: true,
    message: "Admin logged in successfully, redirecting to dashboard",
  })


})

const adminLogout = TryCatch(async (req, res, next) => {
  res.status(200).cookie("admin-token", "", {...cookieOptions, maxAge: 0}).json({
    success: true,
    message: "Admin logged in successfully, redirecting to dashboard",
  })
})

const allUsers =  TryCatch(async (req, res, next) => {
  const users = await User.find({});

  const transformedUsers = await Promise.all(users.map(async({name,username,  _id, avatar})=> {

    const  [groups, friends] = await Promise.all([
      Chat.countDocuments({groupChat: true, members: _id}),
      Chat.countDocuments({groupChat: false, members: _id})
    ]); 
    
    return {
      name,
      username,
      _id,
      avatar: avatar.url,
     groups,
     friends
    }
  }))

  res.status(200).json({
    success: true,
    friends: transformedUsers
  })
})


const allChats = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({})
  .populate("members", "name avatar")
  .populate("creator", "name avatar");

  const transfromedChats = await Promise.all(chats.map(async({members, creator, groupChat, _id, name})=> {
    const totalMessages = await Message.countDocuments({chat: _id});
    return {
      _id,
      name,
      groupChat,
      avatar: members.slice(0,3).map((member)=> member.avatar.url),
      members: members.map(({name, avatar, _id})=> {
        return {
          name,
          avatar: avatar.url,
          _id
        }
      }),
      creator: {
        name: creator?.name || "None",
        avatar: creator?.avatar.url || "",
      },
      totalMessages
    }
  }))
  res.status(200).json({
    success: true,
    chats: transfromedChats
  })
})

const allMessages = TryCatch(async (req, res, next) => {
  const messages = await Message.find({}).populate("sender", "name avatar").populate("chat", "name groupChat");

  const transfromedMessages = messages.map(({ attachment, sender, createdAt, chat, content, _id})=> {
    return {
      _id,
      attachment,
      createdAt,
      content,
      chat: chat._id,
      groupChat: chat.groupChat,
      sender: {
        _id: sender._id,
        name: sender?.name,
        avatar: sender?.avatar.url,
      },
    }
  })
  res.status(200).json({
    success: true,
    messages: transfromedMessages
  })
})



const getDashboardStats = TryCatch(async (req, res, next) => {
  const [groupsCount, usersCount, messagesCount, totalChatsCount] = await Promise.all([
    Chat.countDocuments({ groupChat: true }),
    User.countDocuments(),
    Message.countDocuments(),
    Chat.countDocuments(),
  ]);

  const today = new Date();
  const last7Days = new Date();
  last7Days.setDate(today.getDate() - 7);

  const last7DaysMessages = await Message.find({
    createdAt: {
      $gte: last7Days,
      $lte: today
    }
  }).select("createdAt");

  const messages = new Array(7).fill(0);

  last7DaysMessages.forEach((message) => {
    const index = Math.floor((today - message.createdAt) / (1000 * 60 * 60 * 24));
    if (index >= 0 && index < 7) {
      messages[6 - index] += 1;
    }
  });

  const stats = {
    groupsCount,
    usersCount,
    messagesCount,
    totalChatsCount,
    messagesChart: messages
  };

  res.status(200).json({
    success: true,
    stats
  });
});


export { adminLogin, adminLogout,  allUsers , allChats, allMessages, getDashboardStats }