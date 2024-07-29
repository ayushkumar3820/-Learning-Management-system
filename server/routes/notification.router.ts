import  express  from "express";
import { isAuthication,authorizeRoles } from "../middelware/auth";
import { getNotification,updateNotification } from "../controller/notification.controller";
const notificationRouter=express.Router();

notificationRouter.get("/get-all-Notification",isAuthication,authorizeRoles("user"),getNotification);
notificationRouter.put("/Update-Notification/:id",isAuthication,authorizeRoles("user"),updateNotification);

export default notificationRouter;
