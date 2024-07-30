import { Request, Response, NextFunction } from 'express';
import cloudinary from 'cloudinary';
import LayoutModel from '../model/layout.model';
import ErrorHandler from '../utils/ErrorHandle';
import { CatchAsyncError } from '../middelware/CatchAsyncError'; 
import { title } from 'process';

export const createLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;
        const isTypeExist = await LayoutModel.findOne({ type });
        if (isTypeExist) {
            return next(new ErrorHandler(`${type} already exists`, 400));
        }

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
            const faqItems = await Promise.all(
                faq.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer,
                    };
                })
            );
            await LayoutModel.create({ type: "FAQ", faq: faqItems });
        }

        if (type === "Categories") {
            const { categories } = req.body;
            const categoriesItems = await Promise.all(
                categories.map(async (item: any) => {
                    return {
                        title: item.title,
                    };
                })
            );
            await LayoutModel.create({ type: "Categories", categories: categoriesItems });
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

//edit Layout page 
export const editLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;
       
        if (type === "Banner") {
            const bannerData:any =await  LayoutModel.findOne ({type:"Banner"});
            const { image, title, subtitle } = req.body;
            if(bannerData){
                await  cloudinary.v2.uploader.destroy(bannerData.image.public_id);
            }
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
            await LayoutModel.findByIdAndUpdate(bannerData._id,{banner});
        }

        if (type === 'FAQ') {
            const { faq } = req.body;
            const  faqItem= await LayoutModel.findOne({type:"FAQ"});
            
            const faqItems = await Promise.all(
                faq.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer,
                    };
                })
            );
            await LayoutModel.create(faqItem?._id,{ type: "FAQ", faq: faqItems });
        }

        if (type === "Categories") {
            const { categories } = req.body;
            const categoriesItem=await LayoutModel.findOne({type:"categories"});
            const categoriesItems = await Promise.all(
                categories.map(async (item: any) => {
                    return {
                        title: item.title,
                    };
                })
            );
            await LayoutModel.findByIdAndUpdate(categoriesItem?._id,{ type: "Categories", categories: categoriesItems });
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

//get layout by type
export const getLayout=CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const type=req.params.type;
         const layout =await LayoutModel.findOne({type});
         res.status(200).json({
            success:true,
            layout,
         })
    }
    catch(error:any ){
        return next(new ErrorHandler(error.message, 400));
    }
})