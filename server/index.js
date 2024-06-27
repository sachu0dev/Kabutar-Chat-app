import express from "express";
import userRouter from "./routes/user.js";
import chatRouter from "./routes/chat.js";
import adminRouter from "./routes/admin.js";
import 'dotenv/config'
import { connectDB } from "./utils/featurns.js";
import { errorMiddleware } from "./middlewares/error.js";
import cookie from "cookie-parser";
import { createMessagesInChat, createSampleChats, createSampleGroupChats } from "./seeders/chat.js";



const app = express();
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


app.use(errorMiddleware)
app.listen(port, () => {
  console.log("Server started on port: " + port + " in " + process.env.NODE_ENV + " mode");
});