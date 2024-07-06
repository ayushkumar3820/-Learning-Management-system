import express from "express";
import { registrationUser, activationUser, loginUser, logoutUser, socialAuth,updateAccessToken,getUserInfo ,updateUserInfo,updateInfoPassword, ProfilePictureUpdate} from "../controller/user.controller";
import { isAuthication ,authorizeRoles} from "../middelware/auth";
const userRouter = express.Router();

userRouter.post('/registration', registrationUser);
userRouter.post('/activate-user', activationUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout',isAuthication,authorizeRoles("user"), logoutUser);
userRouter.get("/refresh",updateAccessToken);
userRouter.get("/me",isAuthication,getUserInfo);
userRouter.post("/social",socialAuth);
userRouter.put("/updateInfo",isAuthication,updateUserInfo);
userRouter.put("/updatePassword",isAuthication,updateInfoPassword);
userRouter.put("/updateProfilePicture",isAuthication,ProfilePictureUpdate);
export default userRouter;
