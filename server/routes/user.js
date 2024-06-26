import express from "express";
import { accpectRequest, getMyprofile, login, logout, newUser, searchUser, sendRequest } from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenicated } from "../middlewares/auth.js";
const userRouter = express.Router();




userRouter.post("/new",singleAvatar, newUser );
userRouter.post("/login", login);
//  protected routes
userRouter.use(isAuthenicated);

userRouter.get("/me", getMyprofile);
userRouter.get("/logout", logout);
userRouter.get("/search", searchUser);
userRouter.put("/send-request", sendRequest);
userRouter.put("/accept-request", accpectRequest);




export default userRouter;