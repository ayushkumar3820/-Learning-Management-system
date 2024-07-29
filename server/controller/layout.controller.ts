import { Request, Response, NextFunction } from 'express';
import cloudinary from 'cloudinary';
import LayoutModel from '../model/layout.model';
import ErrorHandler from '../utils/ErrorHandle';
import { CatchAsyncError } from '../middelware/CatchAsyncError'; 

export const createLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;
        
        if (type === "Banner") {
            const { image, title, subtitle } = req.body;
            const myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: "layout",
            });
            const banner = {
                type,
                banner: {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url
                    },
                    title,
                    subtitle
                }
            };
            await LayoutModel.create(banner);
        }
        
        if (type === 'FAQ') {
            const { faq } = req.body;
            await LayoutModel.create({ type, faq });
        }
        
        if (type === "Categories") {
            const { categories } = req.body;
            await LayoutModel.create({ type, categories });
        }
        
        res.status(201).json({
            success: true,
            message: "Layout created successfully"
        });
    }
    catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});