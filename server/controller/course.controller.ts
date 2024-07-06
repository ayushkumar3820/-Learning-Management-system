import { Request, Response, NextFunction } from 'express';
import cloudinary from 'cloudinary';
import { CatchAsyncError } from '../middelware/CatchAsyncError';
import ErrorHandler from '../utils/ErrorHandle';
import { createCourse } from '../services/couser.services';
import CourserModel from '../model/couser.model';


export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;

        if (thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses"
            });

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }

        await createCourse(req, res, next);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


export const editCouser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;

        if (thumbnail) {
            await cloudinary.v2.uploader.destroy(thumbnail.public_id);

            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses"
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
            course
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});