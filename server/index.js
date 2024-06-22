import express from "express";
import userRouter from "./routes/user.js";
import 'dotenv/config'
import { connectDB } from "./utils/featurns.js";



const app = express();
// middlewares
app.use(express.json());

const port = process.env.PORT || 3000;
connectDB(process.env.MONGO_URI);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/user", userRouter);

app.listen(port, () => {
  console.log("Server started on port 3000");
});