import express from "express";
import { adminLogin, adminLogout, allChats, allMessages, allUsers, getDashboardStats } from "../controllers/admin.js";
import { adminOnly } from "../middlewares/auth.js";
const adminRouter = express.Router();



adminRouter.post("/verify", adminLogin)
adminRouter.get("/logout", adminLogout)
adminRouter.use(adminOnly)
adminRouter.get("/", (req, res) => {
  res.send("Authnicated");
})
adminRouter.get("/users", allUsers)
adminRouter.get("/chats", allChats)
adminRouter.get("/messages", allMessages)
adminRouter.get("/stats", getDashboardStats)









export default adminRouter;