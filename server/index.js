import express from "express";
import userRouter from "./routes/user.js";
import chatRouter from "./routes/chat.js";
import 'dotenv/config'
import { connectDB } from "./utils/featurns.js";
import { errorMiddleware } from "./middlewares/error.js";
import cookie from "cookie-parser";
import { createUser } from "./seeders/user.js";


const app = express();
// middlewares
app.use(express.json());
app.use(cookie());

const port = process.env.PORT || 3000;
connectDB(process.env.MONGO_URI);

// createUser(20)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);

app.use(errorMiddleware)
app.listen(port, () => {
  console.log("Server started on port 3000");
});