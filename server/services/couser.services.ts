import CourserModel from "../model/couser.model";
import { CatchAsyncError } from "../middelware/CatchAsyncError";
import { NextFunction, Response, Request } from "express";

// createCourse
export const createCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const course = await CourserModel.create(data);
    res.status(201).json({ success: true, course });
});


//Get All  Users
export const getAllCourseServices=async(res:Response)=>{
    const course=await CourserModel.find().sort({carateAt:-1})
    res.status(201).json({
      success:true,
      course
    })
  }