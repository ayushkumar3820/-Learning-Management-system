import express  from "express";
import { authorizeRoles, isAuthication } from "../middelware/auth";
import { uploadCourse,editCouser,getSingleCourser,getAlLCouser,getCourserByUser,addQuestion,addAnswer,addReview,addReplyReview } from "../controller/course.controller";
const couserRouter =express.Router();


couserRouter.post("/create-couser",isAuthication,uploadCourse);
couserRouter.put("/editCouser/:id",isAuthication,editCouser)

couserRouter.get("/singlecourser/:id", getSingleCourser);
couserRouter.get("/allCourser", getAlLCouser);
couserRouter.get("/allCourser-content/:id",isAuthication, getCourserByUser);
couserRouter.put("/add-question",isAuthication, addQuestion);
couserRouter.put("/add-Answer",isAuthication, addAnswer);
couserRouter.put("/add-review/:id", isAuthication, addReview);
couserRouter.put("/add-replyReview",isAuthication,authorizeRoles("user"),addReplyReview);
export default couserRouter;