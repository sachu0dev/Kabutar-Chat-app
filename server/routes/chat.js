import express from "express";
import { isAuthenicated } from "../middlewares/auth.js";
import { 
  addMembers, 
  deleteChatDetails, 
  getChatDetails, 
  getMessages, 
  getMyChats, 
  getMyGroups, 
  leaveGroup, 
  newGroupChat, 
  removeMember, 
  renameGroup, 
  sendAttachment 
} from "../controllers/chat.js";
import { attachmentMulter } from "../middlewares/multer.js";

const chatRouter = express.Router();

chatRouter.use(isAuthenicated);

chatRouter.post("/new", newGroupChat);
chatRouter.get("/chats", getMyChats);
chatRouter.get("/groups", getMyGroups);

chatRouter.put("/addmembers", addMembers);
chatRouter.put("/removemembers", removeMember);

chatRouter.delete("/leave/:id", leaveGroup);

chatRouter.post("/message", attachmentMulter, sendAttachment);

chatRouter
  .route("/:id")
  .get(getChatDetails)
  .put(renameGroup)
  .delete(deleteChatDetails);

chatRouter.get("/message/:id", getMessages);

export default chatRouter;
