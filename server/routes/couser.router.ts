import express  from "express";
import { authorizeRoles, isAuthication } from "../middelware/auth";
import { uploadCourse,editCouser } from "../controller/course.controller";
const couserRouter =express.Router();


couserRouter.post("/create-couser",isAuthication,uploadCourse);
couserRouter.put("/editCouser/:id",isAuthication,editCouser)
export default couserRouter;