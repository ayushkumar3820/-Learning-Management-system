import express from "express";
import { registrationUser, activationUser, loginUser, logoutUser } from "../controller/user.controller";
import { isAuthication ,authorizeRoles} from "../middelware/auth";
const userRouter = express.Router();

userRouter.post('/registration', registrationUser);
userRouter.post('/activate-user', activationUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout',isAuthication,authorizeRoles("admin"), logoutUser);
export default userRouter;
