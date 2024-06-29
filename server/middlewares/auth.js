import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";
import  jwt  from 'jsonwebtoken';

const isAuthenicated = TryCatch(async(req, res, next) => {
  const token = req.cookies.token;
  if(!token) return next(new ErrorHandler("Please Login to access this resource", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decoded._id;

  next()
})


const adminOnly = TryCatch(async(req, res, next) => {
  const token = req.cookies["admin-token"];
  if(!token) return next(new ErrorHandler("Please Login to access this resource", 401));

  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  req.user = decoded;
  next()
})

export {isAuthenicated, adminOnly}