import express from "express";
import { isAuthenicated } from "../middlewares/auth.js";
import { getMyChats, newGroupChat } from "../controllers/chat.js";


const chatRouter = express.Router();

chatRouter.use(isAuthenicated);


chatRouter.post("/new", newGroupChat);
chatRouter.get("/chats", getMyChats);



export default chatRouter;