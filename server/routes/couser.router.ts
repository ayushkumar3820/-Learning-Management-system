import express  from "express";
import { authorizeRoles, isAuthication } from "../middelware/auth";
import { uploadCourse,editCouser,getSingleCourser,getAlLCouser,getCourserByUser } from "../controller/course.controller";
const couserRouter =express.Router();


couserRouter.post("/create-couser",isAuthication,uploadCourse);
couserRouter.put("/editCouser/:id",isAuthication,editCouser)

couserRouter.get("/singlecourser/:id", getSingleCourser);
couserRouter.get("/allCourser", getAlLCouser);
couserRouter.get("/allCourser-content/:id",isAuthication, getCourserByUser);
export default couserRouter;