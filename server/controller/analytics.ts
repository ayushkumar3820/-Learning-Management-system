import { CatchAsyncError } from "../middelware/CatchAsyncError";
import ErrorHandler from "../utils/ErrorHandle";
import userModel from "../model/user.model"
import { NextFunction,Response,Request } from "express";
import { generateLast12MonthData } from "../utils/analytics";
import CourserModel from "../model/couser.model";
import OrderModel from "../model/OrderModel";


export const getUserAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await generateLast12MonthData(userModel);
        res.status(200).json({
            success: true,
            user
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const getCourseAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const course = await generateLast12MonthData(CourserModel);
        res.status(200).json({
            success: true,
            course
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const getOrderAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await generateLast12MonthData(OrderModel);
        res.status(200).json({
            success: true,
            order
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});