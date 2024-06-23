import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import {Chat} from "../models/chat.js";
import { emitEvent } from "../utils/featurns.js";
import { ALERT } from "../constants/events.js";
import { getOtherMembers } from "../lib/helper.js";


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

  
 const chats = await Chat.find({members: req.user}).populate("members", "name avatar");

 const transformChats = chats.map(({_id, name, members, groupChat}) => {

  return {
    _id,
    name: groupChat?name: getOtherMembers(members, req.user).name,
    avatar: groupChat?members.slice(0, 3).map(({avatar})=> avatar.url): 
    [getOtherMembers(members, req.user).avatar.url],
    members: members.reduce((prev, curr)=> {
      if(curr._id.toString() !== req.user.toString()){
        prev.push(curr._id) 
      }
      return prev
    },[]),
    groupChat
  }
 })

  return res.status(200).json({
    success: true,
    transformChats
  });
});

export { newGroupChat , getMyChats}