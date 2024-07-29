import express from "express";
import { registrationUser, activationUser,deleteUser, loginUser, logoutUser,getAllUser, updateRole,socialAuth,updateAccessToken,getUserInfo ,updateUserInfo,updateInfoPassword, ProfilePictureUpdate} from "../controller/user.controller";
import { isAuthication ,authorizeRoles} from "../middelware/auth";
const userRouter = express.Router();

userRouter.post('/registration', registrationUser);
userRouter.post('/activate-user', activationUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout',isAuthication, logoutUser);
userRouter.get("/refresh",updateAccessToken);
userRouter.get("/me",isAuthication,getUserInfo);
userRouter.post("/social",socialAuth);
userRouter.put("/updateInfo",isAuthication,updateUserInfo);
userRouter.put("/updatePassword",isAuthication,updateInfoPassword);
userRouter.put("/updateProfilePicture",isAuthication,ProfilePictureUpdate);
userRouter.get("/getAll-user",isAuthication,authorizeRoles("user"),getAllUser);
userRouter.put("/updateRole",isAuthication,authorizeRoles("user"),updateRole);
userRouter.delete("/deleteUser/:id",isAuthication,deleteUser);
export default userRouter;
