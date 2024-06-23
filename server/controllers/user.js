import { compare } from 'bcrypt';
import { User } from '../models/user.js';
import { sendToken } from '../utils/featurns.js';
import { TryCatch } from '../middlewares/error.js';
import { ErrorHandler } from '../utils/utility.js';

const newUser = TryCatch(async (req, res, next) => {

  const { name, username, password, bio } = req.body;
const avatar = {
  public_id: "Chaman",
  url: "https://res.cloudinary.com/dh1m1vq3d/image/upload/v1656813496/kabutar/avatar_chaman.jpg",
}
const user = await User.create({name, username, password, bio,  avatar});
console.log("User created: " + user._id );
sendToken(res, user, 201, "User created successfully");

})

const login = TryCatch(async(req, res, next) => {
  const { username, password } = req.body;
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


const seatchUser = TryCatch(async (req, res) => {

  const { name } = req.query
  console.log(name);
  
  return res.status(200).json({
    success: true,
    message: name
  })
})

export { login, newUser, getMyprofile , logout, seatchUser}