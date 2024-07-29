import ErrorHandler from "../utils/ErrorHandle";
import { CatchAsyncError } from "../middelware/CatchAsyncError";
import NotificationModel from "../model/notification";
import { NextFunction,Request,Response } from "express";
import { create } from "domain";
import  cron from "node-cron";


export const getNotification = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Fetching notifications...");
        const notification = await NotificationModel.find().sort({ createdAt: -1 });
        console.log("nnnnnnnnnnnnnnnnnnnnnnnn",notification);
        res.status(200).json({
            success: true,
            notification
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});



export const updateNotification=CatchAsyncError(async(res:Response,req:Request,next:NextFunction)=>{
    try {
            const notification =await  NotificationModel.findById(req.params.id);
            if(!notification){
                return next(new ErrorHandler('Notification not found',404));
            }
            else{
                notification.status?(notification.status = "read"):  notification.status;
            }
            await notification.save();
            const notifications=await NotificationModel.find().sort({
                createdAt:-1
            })

            res.status(200).json({
                success:true,
                notifications
                })
    }catch(error:any){
        return next(new ErrorHandler(error.message,500))
    }
});


//deleted  notification --only admin
cron.schedule("0 0 0 * * *", async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await NotificationModel.deleteMany({status: "read", createdAt: {$lt: thirtyDaysAgo}});
    console.log("Deleted read notifications");
});