import { Request, Response, NextFunction } from "express";
import cloudinary from "cloudinary";
import { CatchAsyncError } from "../middelware/CatchAsyncError";
import ErrorHandler from "../utils/ErrorHandle";
import { createCourse ,getAllCourseServices} from "../services/couser.services";
import CourserModel from "../model/couser.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import sendMail from "../utils/sendMail";
import ejs from "ejs";
import path from "path";
import { IUser } from "../model/user.model";
import NotificationModel from "../model/notification";

export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      

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



interface IAddQuestionData {
  question: string;
  contentId: string;
  courserId: string;
}

export const addQuestion = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, contentId, courserId }: IAddQuestionData = req.body;

    // Validate courserId
    if (!mongoose.Types.ObjectId.isValid(courserId)) {
      return next(new ErrorHandler("Invalid course id", 400));
    }

    const course = await CourserModel.findById(courserId);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    // Validate contentId
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("Invalid content id format", 400));
    }

    const courseContent = course.courserData?.find((item: any) => item._id.toString() === contentId);
    if (!courseContent) {
      return next(new ErrorHandler("Content not found in the course", 404));
    }

    // Ensure questions array exists
    if (!courseContent.questions) {
      courseContent.questions = [];
    }

    const newQuestion: any = {
      user: req.user,
      question,
      questionReplies: [],
    };

    // Add this question to our course content
    courseContent.questions.push(newQuestion);

    await NotificationModel.create({
      user:req.user?._id,
      title:"New Question",
      message:`You have a new  Question  in ${course?.name}`
      
    })

    // Save the updated course
    await course.save();

    res.status(200).json({
      success: true,
      message: "Question added successfully",
      course
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});

interface IAddAnswerData{
  answer:string,
  courserId:string,
  contentId:string,
  questionId:string

}

interface IAddAnswerData {
  answer: string;
  courserId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { answer, courserId, contentId, questionId }: IAddAnswerData = req.body;
    const course = await CourserModel.findById(courserId);

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("Invalid content id", 400));
    }

    const courseContent = course?.courserData?.find((item: any) => item._id.equals(contentId));
    if (!courseContent) {
      return next(new ErrorHandler("Invalid Content id", 400));
    }

    const question = courseContent.questions?.find((item: any) => item._id.equals(questionId));
    if (!question) {
      return next(new ErrorHandler("Invalid Question id", 400));
    }

    const newAnswer: any = {
      user: req.user, // Ensure user is a mongoose.Types.ObjectId
      answer,
    };

    // Add this answer to course content
    question.questionReplies.push(newAnswer);
    await course?.save();

    if(req.user?._id ===  question.user._id){
      //create a notification 
            await NotificationModel.create({
              user:req.user?._id,
              title:"New Question  Reply   Received",
              message:`You have  a new  Question  reply  in ${courseContent.title}`
            })
    }else{
      const data={
        name: question.user.name,
        title:courseContent.title
      }
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/question-reply.ejs"),
        data
      );
 try{
        await sendMail({
          email:question.user.email,
          subject:"Question-Reply ",
          template:"question-reply.ejs",
          data,
        })
      }catch(error:any){
        return next(new ErrorHandler(error.message,500));
      }
    }

    res.status(200).json({
      success: true,
      message: "Answer added successfully",
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});


interface IReviewData{
  review:string;
  rating:number;
  userId:string;
}

export const addReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  console.log('Entering addReview function');
  try {
    // ... (existing logging code) ...

    if (!req.user) {
      console.log('User not authenticated');
      return next(new ErrorHandler("User not authenticated", 401));
    }

    const courseId = req.params.id;
    console.log('Course ID:', courseId);

    if (!courseId) {
      console.log('Course ID is missing');
      return next(new ErrorHandler("Course ID is required", 400));
    }

    // Remove the course existence check in user's course list
    // Instead, just check if the course exists in the database
    console.log('Fetching course from database');
    const course = await CourserModel.findById(courseId);
    if (!course) {
      console.log('Course not found in database');
      return next(new ErrorHandler("Course not found", 404));
    }

    console.log('Course found:', JSON.stringify(course, null, 2));

    const { review, rating } = req.body;
    if (typeof review !== 'string' || typeof rating !== 'number') {
      console.log('Invalid review data');
      return next(new ErrorHandler("Invalid review data", 400));
    }

    const reviewData: any = {
      user: req.user,
      rating,
      comment: review,
    };

    console.log('Review data:', JSON.stringify(reviewData, null, 2));

    if (!Array.isArray(course.reviews)) {
      console.log('Initializing course reviews array');
      course.reviews = [];
    }

    course.reviews.push(reviewData);

    // Calculate average rating
    let avg = 0;
    course.reviews.forEach((rev: any) => {
      avg += rev.rating;
    });
    course.rating = avg / course.reviews.length;

    console.log('Saving updated course');
    await course.save();

    console.log('Sending response');
    res.status(200).json({
      success: true,
      course
    });
  } catch (error: any) {
    console.error('Error in addReview:', error);
    return next(new ErrorHandler(error.message, 500));
  }
});
//Add reply  in review 

interface  IAddReviewData{
  comment:string,
  reviewId:string,
  courseId:string
}


export const addReplyReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { comment, reviewId, courseId } = req.body as IAddReviewData;

    const course = await CourserModel.findById(courseId);
    if (!course) {
      return next(new ErrorHandler("Course not Found", 400));
    }

    const review = course.reviews?.find((rev: any) => rev._id.toString() === reviewId);
    if (!review) {
      return next(new ErrorHandler("Review not Found", 400));
    }

    const replyData: any = {
      user: req.user ,
      comment,
    };


    console.log("vvvvvvvvv",replyData);

    if (!review.commentReplies) {
      review.commentReplies = [];
    }

    review.commentReplies.push(replyData);

    await course.save();

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});


//get All users  --only  for admin
export const getAllCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
      await getAllCourseServices(res);
  } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
  }
});

// update Role user  ---only    for admin 
export const updateRole = CatchAsyncError(async (req: Request, res: Response, next:NextFunction)=>{
  try{
         const {id,Role}=req.body;
         updateUserRoleServices(id,Role,res);
  }catch(error:any){
      return next(new ErrorHandler(error.message,400));
  }
      

})


//Deletd course --only for admin Role baicse
export const deleteCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction)=>{
    try{
      const {id}=req.params;
      const course= await CourserModel.findById(id);
      if(!course){
          return next(new ErrorHandler('User not found',404))
      }
      await course.deleteOne({id});
      await redis.del(id);
      res.status(200).json({
          success:true,
          message:`course deleted successfully `
      })

      }
      catch(error:any){
          return next(new ErrorHandler(error.message,400))
      }

    
});