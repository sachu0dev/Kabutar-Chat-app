import cookie from "cookie-parser";
import 'dotenv/config';
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";

import { getSockets } from "./lib/helper.js";
import { errorMiddleware } from "./middlewares/error.js";
import adminRouter from "./routes/admin.js";
import chatRouter from "./routes/chat.js";
import userRouter from "./routes/user.js";
import { connectDB } from "./utils/featurns.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { Message } from "./models/message.js";



const app = express();
const server = createServer(app);
const io = new Server(server, {})

const userSocketIDs = new Map();

// middlewares

app.use(express.json());
app.use(cookie());



const port = process.env.PORT || 3000;
connectDB(process.env.MONGO_URI);


// seeders
// createSampleChats(10);
// createSampleGroupChats(10);
// createMessagesInChat("667a601580c777ca7f262ff8", 60)


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/admin", adminRouter);

io.use((socket, next) => {
  
})

io.on("connection", (socket) => {
  const user = {
    _id:"jlksfjdklf",
    name: "sachin",
  }
  userSocketIDs.set(user._id.toString(), socket.id.toString());
  console.log(userSocketIDs);

  socket.on(NEW_MESSAGE, async ({chatId, members, message}) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name
      },
      chat: chatId,
      createdAt: new Date().toISOString()
    }

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId
    }

    const membersSockets = getSockets(members);
    console.log(membersSockets);
    io.to(membersSockets).emit(NEW_MESSAGE, {
      message: messageForRealTime,
      chatId
    });
    
    io.to(membersSockets).emit(NEW_MESSAGE_ALERT, 
      { chatId}
    );
    // try {
    //   await Message.create(messageForDB);
    // } catch (error) {
    //   console.log(error);
    // }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.id);
    userSocketIDs.delete(user._id.toString());
  });
 
  });

app.use(errorMiddleware)


server.listen(port, () => {
  console.log("Server started on port: " + port + " in " + process.env.NODE_ENV + " mode");
});

export { userSocketIDs };
