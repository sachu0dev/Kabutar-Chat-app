import 'dotenv/config';
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";
import mongoose from "mongoose";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import { getSockets } from "./lib/helper.js";
import { errorMiddleware } from "./middlewares/error.js";
import adminRouter from "./routes/admin.js";
import chatRouter from "./routes/chat.js";
import userRouter from "./routes/user.js";
import { connectDB } from "./utils/featurns.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { Message } from "./models/message.js";
import cookieParser from "cookie-parser";
import { socketAuthenticator } from "./middlewares/auth.js";

// Setup
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:4173", process.env.CLIENT_URL],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
  }
});
const userSocketIDs = new Map();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:4173", process.env.CLIENT_URL],
  credentials: true,
}));

const port = process.env.PORT || 3000;

connectDB(process.env.MONGO_URI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/admin", adminRouter);

// Socket.IO authentication
io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, async (err) => {
    await socketAuthenticator(err, socket, next);
  });
});

// Socket.IO connection
io.on("connection", (socket) => {
  const user = socket.user;
  userSocketIDs.set(user._id.toString(), socket.id.toString());

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: new mongoose.Types.ObjectId(chatId),
    };
    console.log("emitting", members);

    const membersSockets = getSockets(members);
    console.log("members", membersSockets);

    io.to(membersSockets).emit(NEW_MESSAGE, {
      message: messageForRealTime,
      chatId,
    });
    io.to(membersSockets).emit(NEW_MESSAGE_ALERT, { chatId });

    try {
      await Message.create(messageForDB);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.id);
    userSocketIDs.delete(user._id.toString());
  });
});

// Error Middleware
app.use(errorMiddleware);

// Start Server
server.listen(port, () => {
  console.log(`Server started on port: ${port} in ${process.env.NODE_ENV} mode`);
});

export { userSocketIDs };