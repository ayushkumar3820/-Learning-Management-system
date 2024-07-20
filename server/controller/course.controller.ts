import { Request, Response, NextFunction } from "express";
import cloudinary from "cloudinary";
import { CatchAsyncError } from "../middelware/CatchAsyncError";
import ErrorHandler from "../utils/ErrorHandle";
import { createCourse } from "../services/couser.services";
import CourserModel from "../model/couser.model";

import { redis } from "../utils/redis";
import mongoose from "mongoose";

export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      console.log("222222222222222",thumbnail);

      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      await createCourse(req, res, next);
      console.log("this is role basic not working ",createCourse);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//edit course
export const editCouser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      if (thumbnail && thumbnail.public_id) {
        // Destroy the existing thumbnail if it has a public_id
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);

        // Upload the new thumbnail
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail.path, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const couserId = req.params.id;
      const course = await CourserModel.findByIdAndUpdate(
        couserId,
        { $set: data },
        { new: true }
      );

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//one single course ke liya
export const getSingleCourser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      // Check if the course data exists in the cache
      const isCacheExist = await redis.get(courseId);
      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        return res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourserModel.findById(req.params.id).select(
          "-courserData.videoUrl -courserData.suggestion -courserData.questions -courserData.links"
        );

        await redis.set(courseId, JSON.stringify(course));

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


// all cosuser ek sathe get ke liya api in get form 

export const getAlLCouser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isCacheExist = await redis.get("allCourser");
    if (isCacheExist) {
      const courses = JSON.parse(isCacheExist);
      console.log("hitting in redis");
      res.status(200).json({
        success: true,
        courses,
      });
    } else {
      const course = await CourserModel.find().select(
        "-courserData.videoUrl -courserData.suggestion -courserData.questions -courserData.links"
      );
      await redis.set("allCourser", JSON.stringify(course));
      console.log("hitting is couser in redis");

      res.status(200).json({
        success: true,
        course,
      });
    }
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});


export const getCourserByUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('req.user:', req.user);
    const userCourses = req.user?.courses;
    const courseId = req.params.id;

    console.log('userCourses:', userCourses);
    console.log('courseId:', courseId);

    const courseExists = userCourses?.some(course => course._id.toString() === courseId);

    if (!courseExists) {
      return next(new ErrorHandler("You are not eligible to access this course", 404));
    }

    const course = await CourserModel.findById(courseId);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    const content = course.courserData;

    res.status(200).json({
      success: true,
      content
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});
interface IAddQuestionData{
          question:string,
          courserId:string,
          contentId:string
}



export const addQuestion = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, contentId, courserId }: IAddQuestionData = req.body;
    const course = await CourserModel.findById(courserId);

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("Invalid content id", 400));
    }

    const courseContent = course?.courserData?.find((item: any) => item._id.equals(contentId));

    if (!courseContent) {
      return next(new ErrorHandler("Invalid Content id", 400));
    }

    const newQuestion:any  = {
      user: req.user,
      question,
      questionReplies: [],
    };

    // Add this question to our course content
    courseContent.questions.push(newQuestion);

    // Save the updated course
    await course?.save();
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});
