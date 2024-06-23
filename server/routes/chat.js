import express from "express";
import { isAuthenicated } from "../middlewares/auth.js";
import { addMembers, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMember } from "../controllers/chat.js";


const chatRouter = express.Router();

chatRouter.use(isAuthenicated);


chatRouter.post("/new", newGroupChat);
chatRouter.get("/chats", getMyChats);
chatRouter.get("/groups", getMyGroups);
chatRouter.put("/addmembers", addMembers)
chatRouter.put("/removemembers", removeMember)
chatRouter.delete("/leave/:id", leaveGroup)
chatRouter.post("message",)

export default chatRouter;