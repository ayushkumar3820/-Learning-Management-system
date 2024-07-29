require("dotenv").config();
import userModel, { IUser } from "../model/user.model";
import ErrorHandler from "../utils/ErrorHandle";
import { CatchAsyncError } from "../middelware/CatchAsyncError";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from 'ejs';
import path from "path";
import { NextFunction, Response, Request } from "express";
import sendMail from "../utils/sendMail";
import { sendToken,refreshTokenOptions, accessTokenOptions} from "../utils/jwt";
import { redis } from "../utils/redis";
import { getUserById,getAllUserServices ,updateUserRoleServices} from "../services/user.services";

import cloudinary from "cloudinary";
import { count, countReset } from "console";

// Interface for registration body
interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

// Interface for activation token
interface IActivationToken {
    token: string;
    activationCode: string;
}

// Function to create activation token
export const createActivationToken = (user: IRegistrationBody): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign(
        {
            user,
            activationCode
        },
        process.env.ACTIVATION_SECRET as Secret,
        {
            expiresIn: "5m",
        }
    );
    // console.log("Activation Code:", activationCode); 
    // console.log("Activation Token:", token); 
    return { token, activationCode };
};

// Function to register a user
export const registrationUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body as IRegistrationBody;
        const isEmailExist = await userModel.findOne({ email });

        if (isEmailExist) {
            return next(new ErrorHandler("Email already exists", 400));
        }

        const user: IRegistrationBody = { name, email, password };
        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode;

        const data = { user: { name: user.name }, activationCode };
        const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), data);

        try {
            await sendMail({
                email: user.email,
                subject: "Activate your account",
                template: "activation-mail.ejs",
                data
            });

            res.status(201).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account`,
                activationToken: activationToken.token,
                activationCode: activationCode
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 400));
    }
});

interface IActivationRequest {
    activation_code: string;
    activation_token: string;
}

interface IActivationRequest {
    activation_code: string;
    activation_token: string;
}

export const activationUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { activation_code, activation_token } = req.body as IActivationRequest;

        // console.log("Received activation_code:", activation_code);
        // console.log("Received activation_token:", activation_token);

        if (!activation_token) {
            return next(new ErrorHandler("Activation token must be provided", 400));
        }

        const newUser: { user: IUser; activationCode: string } = jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET as string
        ) as { user: IUser; activationCode: string };

        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler("Invalid activation code", 400));
        }

        const { name, email, password } = newUser.user;

        const existsUser = await userModel.findOne({ email });
        if (existsUser) {
            return next(new ErrorHandler("Email already exists", 400));
        }

        const user = await userModel.create({
            name,
            email,
            password
        });

        res.status(201).json({
            success: true
        });
    } catch (error: any) {
        console.error("Error in activationUser:", error);
        return next(new ErrorHandler(error.message, 400));
    }
});


interface ILoginRequest {
    email: string;
    password: string;
}

export const loginUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as ILoginRequest;
        if (!email || !password) {
            return next(new ErrorHandler("Please enter email and password", 400));
        }

        const user = await userModel.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("Invalid email and password", 400));
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler("Invalid email and password", 400));
        }

        sendToken(user, 200, res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const logoutUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Set the access and refresh tokens to expire immediately
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });

        // Check if the user is authenticated and retrieve the user ID
        const userId = req.user?._id;

        // If a user ID exists, delete the user's session from Redis
        if (userId) {
            await redis.del(userId.toString());
        }

        // Respond with a success message
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error: any) {
        // Pass any errors to the error handler middleware
        next(new ErrorHandler(error.message, 400));
    }
});


//update access token function 

export const updateAccessToken = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refresh_token = req.cookies.refresh_token as string;

        if (!refresh_token) {
            return next(new ErrorHandler("Refresh token not provided", 400));
        }

        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN as string) as JwtPayload;

        const message = "Could not refresh token";

        if (!decoded) {
            return next(new ErrorHandler(message, 400));
        }

        const session = await redis.get(decoded.id as string);

        if (!session) {
            return next(new ErrorHandler(message, 400));
        }

        const user = JSON.parse(session);

        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN as string, {
            expiresIn: "5m"
        });

        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN as string, {
            expiresIn: "3d"
        });
          req.user=user;

        res.cookie("access_token", accessToken, accessTokenOptions);
        res.cookie("refresh_token", refreshToken, refreshTokenOptions);

        res.status(201).json({
            success: true,
            accessToken
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


   //userinfogetUserById(userId,res);

  export const getUserInfo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id as string;
        if (!userId) {
            return next(new ErrorHandler("User not authenticated", 401));
        }
        await getUserById(userId, res); // Assuming this function sends a response
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
//sociaal auth api
interface ISocialAuthBody {
    email:string;
    name:string;
    avatar:string;
}

export const socialAuth=CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try{
       const {email,name,avatar}=req.body as ISocialAuthBody;
       const user=await userModel.findOne({email});
       if(!user){
        const newUser=await userModel.create({email,name,avatar});
        sendToken(newUser,200,res);
       }
       else{
        sendToken(user,200,res);
       }
    }catch(error:any){
        return next(new ErrorHandler(error.message, 400));
    }
})


interface updateinfo{
    email?:string,
    name?:string,
}

//update user info 
export const updateUserInfo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name } = req.body as updateinfo;
      const userId = req.user?._id;
       console.log(userId);
      // Find user by ID
      const user = await userModel.findById(userId);
      
  
      // Check if the email is already in use by another user
      if (email && user ) {
        const isEmailExits = await userModel.findOne({ email });
        if (isEmailExits ) {
          return next(new ErrorHandler("Email id already exists", 400));
        }
        user.email = email;
      }
  
      // Update name if provided
      if (name && user ) {
        user.name = name;
      }
  
      // Save user changes
      await user?.save();
  
      // Update Redis cache
      await redis.set(userId as string, JSON.stringify(user));
      console.log(userId);
  
      // Respond with success
      res.status(200).json({
        success: true,
        user,
      });
  
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  //update the info password 

  interface updatePassword {
oldPassword:string,
newPassword:string,
  }

  export const updateInfoPassword=CatchAsyncError(async(res:Response,req:Request,next:NextFunction)=>{
         

    try{
        const {oldPassword,newPassword}=req.body as updatePassword;
        if(!oldPassword || !newPassword){
            return next(new ErrorHandler("Please enter both old and new password",400));
        }
        const user =await userModel.findById(req.user?._id).select("+password");
        if(user?.password == undefined){
            return next(new ErrorHandler("invalid user",400))
        }

        const isPasswordMatch=await user?.comparePassword(oldPassword);
        if(!isPasswordMatch){
            return next(new ErrorHandler("old password is incorrect",400));
        }
        user.password=newPassword;
        await user.save();
        await redis.set(req.user?._id as string,JSON.stringify(user));
        res.status(201).json({
            success:true,
            user
        })

    }
    catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
  }
  )


  //update profile picture 
  interface profilepicture{
    avatar : {
        public_id:string,
        url:string
    }
  }

  export const  ProfilePictureUpdate = CatchAsyncError(async(req:Request,res:Request,next:NextFunction)=>{
    try{
        const {avatar}=req.body as profilepicture;

        const userId= req.user?._id;
        const user=await userModel.findById(userId);
        if(avatar && user){
            if(user?.avatar?.public_id){
                await cloudinary.v2.uploader.destroy(user?.avatar?.public_id)
                const myCloud = await cloudinary.v2.uploader.upload(avatar as unknown as string, {
                    folder: 'avatars',
                    width: 150,
                  });
                user.avatar={
                    public_id:myCloud.public_id,
                    url:myCloud.secure_url
                }
            }
            else{
                const myCloud=await cloudinary.v2.uploader.upload(avatar as unknown as string,{
                    folder:"avatars",
                    width:150,
                })
                user.avatar={
                    public_id:myCloud.public_id,
                    url:myCloud.secure_url
                }
            }
        }
        await user?.save();
        await redis.set(userId as string,JSON.stringify(user)); 
        res.status(201).json({
            success: true,
            user,
          });


    }catch(error:any){
        return next(new ErrorHandler(error.message,400))
    }
  })


  //get All users  --only  for admin
  export const getAllUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        await getAllUserServices(res);
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


//Deletd user --only for admin Role baicse
export const deleteUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction)=>{
      try{
        const {id}=req.params;
        const user= await userModel.findById(id);
        if(!user){
            return next(new ErrorHandler('User not found',404))
        }
        await user.deleteOne({id});
        await redis.del(id);
        res.status(200).json({
            success:true,
            message:`User deleted successfully `
        })

        }
        catch(error:any){
            return next(new ErrorHandler(error.message,400))
        }

      
});