import jwt from 'jsonwebtoken';
import { User } from "../models/user.js";
import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";

const isAuthenicated = TryCatch(async(req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  
  if(!token) return next(new ErrorHandler("Please Login to access this resource", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded._id);

  if(!user) return next(new ErrorHandler("Please Login to access this resource", 401));
  req.user = decoded._id;
  next()
})


const adminOnly = TryCatch(async(req, res, next) => {
  const token = req.cookies["admin-token"];
  if(!token) return next(new ErrorHandler("Please Login to access this resource", 401));

  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findById(decoded._id);

    if(!user) return next(new ErrorHandler("Please Login to access this resource", 401));
  req.user = decoded;
  next()
})

const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(new ErrorHandler("Please Login to access this resource", 401));
    const authToken = socket.request.cookies["token"];
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) return next(new ErrorHandler("Please Login to access this resource", 401));
    socket.user = user;

    next();
  } catch (error) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }
};

export { adminOnly, isAuthenicated, socketAuthenticator };
