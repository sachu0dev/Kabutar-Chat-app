import mongoose from "mongoose";
import  jwt  from "jsonwebtoken";
import  {v2 as cloudinary}  from 'cloudinary';
import { v4 as uuid } from "uuid";
import { getBase64, getSockets } from "../lib/helper.js";
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


const emitEvent = (req, event, users, data) => {
  try {
    const io = req.app.get("io");
    if (!io) throw new Error("Socket.io instance not found");

    const userSockets = getSockets(users);
    console.log(userSockets);
    if (userSockets.length === 0) {
      console.warn(`No valid socket IDs found for event ${event} and users: ${users.join(", ")}`);
      return;
    }

    io.to(userSockets).emit(event, data);
    console.log(`Event ${event} emitted to users: ${users.join(", ")}`);
  } catch (error) {
    console.error(`Failed to emit event ${event}:`, error);
  }
};




const uploadFilesToCloud = async (files = []) => {
  const uploadPromises = files.map(async (file) => {
    try {
      const base64File = getBase64(file);
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(base64File, {
          resource_type: "auto",
          public_id: uuid()
        }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
      });
    } catch (error) {
      throw new Error(`Error converting file to base64: ${error.message}`);
    }
  });

  try {
    const results = await Promise.all(uploadPromises);
    return results.map(result => ({
      public_id: result.public_id,
      url: result.secure_url
    }));
  } catch (error) {
    throw new Error(`Error uploading files to Cloudinary: ${error.message}`);
  }
};

const deleteFilesFromCloud  = (public_ids) =>{
  console.log(public_ids);
}


export { connectDB, sendToken, cookieOptions, emitEvent, deleteFilesFromCloud, uploadFilesToCloud }