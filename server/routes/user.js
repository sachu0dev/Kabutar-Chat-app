import express from "express";
import { login, newUser } from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
const userRouter = express.Router();




userRouter.post("/new",singleAvatar, newUser );
userRouter.post("/login", login);

export default userRouter;