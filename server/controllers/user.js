import { compare } from 'bcrypt';
import { User } from '../models/user.js';
import { emitEvent, sendToken } from '../utils/featurns.js';
import { TryCatch } from '../middlewares/error.js';
import { ErrorHandler } from '../utils/utility.js';
import { accpectRequestSchema, loginSchema, searchUserSchema, sendRequestSchema, signUpSchema } from '../lib/validators.js';
import { Chat } from '../models/chat.js';
import { Request } from '../models/request.js';
import { NEW_REQUEST, REFETCH_CHATS } from '../constants/events.js';
;

const newUser = TryCatch(async (req, res, next) => {

  const { name, username, password, bio } = req.body;
const avatar = {
  public_id: "Chaman",
  url: "https://res.cloudinary.com/dh1m1vq3d/image/upload/v1656813496/kabutar/avatar_chaman.jpg",
}
const isValidInput = signUpSchema.safeParse({ name, username, password, bio, avatar });
if (!isValidInput.success) {
  const errorMessages = isValidInput.error.issues.map(issue => issue.message).join(", ");
  return next(new ErrorHandler(errorMessages, 400));
}
const user = await User.create(isValidInput.data);
console.log("User created: " + user._id );
sendToken(res, user, 201, "User created successfully");

})

const login = TryCatch(async(req, res, next) => {
  const { username, password } = req.body;
  const isValidInput = loginSchema.safeParse({  username, password  });
  if (!isValidInput.success) {
    const errorMessages = isValidInput.error.issues.map(issue => issue.message).join(", ");
    return next(new ErrorHandler(errorMessages, 400));
  }
  const user = await User.findOne({username}).select("+password");

  if(!user ) return next(new ErrorHandler("Invalid Username", 404));
  const isMatch = await compare(password, user.password);
  if(!isMatch ) return next(new ErrorHandler("Invalid Password", 401));

  sendToken(res, user, 200, `Welcome Back ${user.name}`);
})

const getMyprofile = TryCatch(async (req, res) => {
  const user = await User.findOne(req._id);

  if(!user) return next(new ErrorHandler("User not found", 404));
  res.status(200).json({
    success: true,
    user
  })
})

const logout = TryCatch(async (req, res) => {
  
  return res.status(200).cookie("token", null, { expires: new Date(Date.now()), httpOnly: true }).json({
    success: true,
    message: "Logged Out"
  })
})


const searchUser = TryCatch(async (req, res, next) => {

  const { name = ''} = req.query
  const isValidInput = searchUserSchema.safeParse({ name });

  if (!isValidInput.success) {
    const errorMessages = searchUserSchema.error.issues.map(issue => issue.message).join(", ");
    return next(new ErrorHandler(errorMessages, 400));
  }

  const myChats = await Chat.find({groupChat: false, members: req.user} );

  const allUserFromChats = myChats.map(chat => {
    return chat.members
  }).flat()
//  user that are not friends with user
  const notFriends = await User.find({
    _id: {$nin: allUserFromChats},
    name: {$regex: name, $options: "i"}
  })
  
  const users = notFriends.map(({name, _id, avatar})=> ({
    name,
    _id,
    avatar: avatar.url
  }))
  return res.status(200).json({
    success: true,
    users
  })
})



const sendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;

  const isValidInput = sendRequestSchema.safeParse({ userId });

  if (!isValidInput.success) {
    const errorMessages = sendRequestSchema.error.issues.map(issue => issue.message).join(", ");
    return next(new ErrorHandler(errorMessages, 400));
  }

  const request = await Request.findOne({
    $or: [
      {sender: req.user, receiver: userId},
      {sender: userId, receiver: req.user}
    ]
  })

  if(request) return next(new ErrorHandler("Request already sent", 404));


  await Request.create({
    sender: req.user,
    receiver: userId
  })

  emitEvent(req, NEW_REQUEST, [userId] )
 
  return res.status(200).json({
    success: true,
    message: "Friend request sent"
  })
})

const accpectRequest = TryCatch(async (req, res, next) => {

  const { requestId, accpect } = req.body;

  const isValidInput = accpectRequestSchema.safeParse({ requestId, accpect });

  if (!isValidInput.success) {
    const errorMessages = accpectRequestSchema.error.issues.map(issue => issue.message).join(", ");
    return next(new ErrorHandler(errorMessages, 400));
  }

  const request = await Request.findById(requestId).populate("sender", "name").populate("receiver", "name");

  if(!request) return next(new ErrorHandler("Request not found", 404));
  if(request.receiver._id.toString() !== req.user.toString()) return next(new ErrorHandler("You are not authorized to accept this request", 401));

  if(!accpect){
    await Request.deleteOne(requestId);
    return res.status(200).json({
      success: true,
      message: "Request rejected"
    })
  }
  
  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name} and ${request.receiver.name}`,
    })
    , 
    Request.deleteOne(requestId)
  ])

  emitEvent(req, REFETCH_CHATS, members)
 
  return res.status(200).json({
    success: true,
    message: "Friend request accepted",
    senderId: request.sender._id,
  })
})



export { login, newUser, getMyprofile , logout, searchUser, sendRequest, accpectRequest}