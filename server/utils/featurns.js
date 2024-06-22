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
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET)
  console.log("Authenticated: " + user.username + " mode: Token");
  return res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    message
  })
}


export { connectDB, sendToken }