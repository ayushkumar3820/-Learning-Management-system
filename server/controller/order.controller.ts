import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from '../middelware/CatchAsyncError';
import ErrorHandler from "../utils/ErrorHandle";
import OrderModel, { IOrder } from "../model/OrderModel";
import UserModel, { IUser } from "../model/user.model";
import CourseModel from "../model/couser.model";
import path from "path";
import ejs, { name } from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../model/notification";
import mongoose from "mongoose";
import { title } from "process";
import { newOrder,getAllOrderServices } from "../services/order.services";

// Create order
export const createOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, payment_info } = req.body as IOrder;
        
        const user = await UserModel.findById(req.user?._id) as IUser | null;

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const courseExistsInUser = user?.courses.some(
            (course: any) => course._id.toString() === courseId
        );
        if (courseExistsInUser) {
            return next(new ErrorHandler("You have already purchased this course", 400));
        }
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }


        const Data: any = {
            courseId: new mongoose.Types.ObjectId(courseId),
            userId: user._id,
            payment_info
        };

        const mailData = {
            order: {
                _id: course._id.toString().slice(0, 6),  // Convert ObjectId to string before slicing
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}),
            }
        };

        console.log("wwwwwwwwwwwwwwwww",mailData);

        const html= await ejs.renderFile(path.join(__dirname,'../mails/order-mail.ejs'),{order:mailData})

        try{
            if(user){
                await sendMail({
                    email:user.email,
                    subject:`Order Confirmation`,
                    template:"order-mail.ejs",
                    data:mailData
                });
            }}
            catch(error:any){
                return next(new ErrorHandler(error.message,505));
            }
            user?.courses.push(course?.id);
            await user.save();
            await NotificationModel.create({
                userId: user._id,  // Add this line
                user: user._id,
                title: "New Order",
                message: `You have successfully purchased ${course.name} course`,
                status: "unread",  // Add this line, assuming 'unread' is a valid status
            });
           newOrder(Data,res,next);   
            res.status(201).json({
            success:true,
            order:course,
            })

    } catch (error: any) {
        console.error("Order creation error:", error);
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getAllOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        await getAllOrderServices(res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});