import { User } from '../models/user.js';

const newUser = async (req, res) => {

  const { name, username, password, bio } = req.body;
  const avatar = {
    public_id: "Chaman",
    url: "https://res.cloudinary.com/dh1m1vq3d/image/upload/v1656813496/kabutar/avatar_chaman.jpg",
  }
  const user = await User.create({name, username, password, bio,  avatar});


  res.status(201).json({message: "User created successfully", user: {name, username, password, avatar, bio}});
}

const login = (req, res) => {
  res.send("Login!");
}

export { login, newUser }