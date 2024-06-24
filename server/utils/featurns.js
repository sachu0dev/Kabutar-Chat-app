import mongoose from "mongoose";
import  jwt  from "jsonwebtoken";
import { compare } from "bcrypt";
const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true
}
const connectDB = (url) => {
  mongoose.connect(url,{dbName: "kabutar"})
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(err => {
    console.error('MongoDB Connection Error: ', err);
    process.exit(1);
  });
};
const sendToken = (res,  user, statusCode, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
  console.log("Authenticated: " + user._id + " mode: Token");
  return res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    message
  })
}


const emitEvent = (req, event, users, data)=> {
  console.log("emitEvent: " + event );

}

const deleteFilesFromCloud  = (public_ids) =>{
  console.log(public_ids);
}


export { connectDB, sendToken, cookieOptions, emitEvent, deleteFilesFromCloud }