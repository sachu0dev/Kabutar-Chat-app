import { compare } from 'bcrypt';
import { User } from '../models/user.js';
import { sendToken } from '../utils/featurns.js';
import { TryCatch } from '../middlewares/error.js';

const newUser = TryCatch(async (req, res, next) => {

  const { name, username, password, bio } = req.body;
const avatar = {
  public_id: "Chaman",
  url: "https://res.cloudinary.com/dh1m1vq3d/image/upload/v1656813496/kabutar/avatar_chaman.jpg",
}
const user = await User.create({name, username, password, bio,  avatar});
console.log("User created: " + user.username );
sendToken(res, user, 201, "User created successfully");

})

const login = TryCatch(async(req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({username}).select("+password");

  if(!user ) return next(new Error("Invalid Username"));
  const isMatch = await compare(password, user.password);
  if(!isMatch ) return next(new Error("Invalid Password"));

  sendToken(res, user, 200, `Welcome Back ${user.name}`);
})

const getMyprofile = async (req, res) => {
  const user = await User.findOne(req.username);
  res.status(200).json({
    success: true,
    user
  })
}

export { login, newUser }