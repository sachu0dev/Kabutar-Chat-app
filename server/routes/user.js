import express from "express";
import { acceptRequest, getAllFriends, getAllnotification, getMyprofile, login, logout, newUser, searchUser, sendRequest } from "../controllers/user.js";
import { isAuthenicated } from "../middlewares/auth.js";
import { singleAvatar } from "../middlewares/multer.js";
const userRouter = express.Router();




userRouter.post("/new",singleAvatar, newUser );
userRouter.post("/login", login);
//  protected routes
userRouter.use(isAuthenicated);

userRouter.get("/me", getMyprofile);
userRouter.get("/logout", logout);
userRouter.get("/search", searchUser);
userRouter.put("/send-request", sendRequest);
userRouter.put("/accept-request", acceptRequest);
userRouter.get("/notification", getAllnotification)
userRouter.get("/friends", getAllFriends)




export default userRouter;