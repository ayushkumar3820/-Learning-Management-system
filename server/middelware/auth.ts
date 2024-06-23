require("dotenv").config();
import ErrorHandler from "../utils/ErrorHandle";
import { CatchAsyncError } from "../middelware/CatchAsyncError";
import { Redis } from "ioredis";
import { redis } from "../utils/redis";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../model/user.model";

// Middleware to check if the user is authenticated
export const isAuthication = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    // Extract the access token from cookies
    const access_token = req.cookies.access_token as string;
    console.log('Access Token:', access_token);
    // If no access token is provided, return an error
    if (!access_token) {
        return next(new ErrorHandler("Please login to access this resource", 400));
      
    }

    // Verify the access token
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
    console.log("decoded path",decoded);
    // If the token is not valid, return an error
    if (!decoded) {
        return next(new ErrorHandler("Access token is not valid", 400));
        

    }

    // Get the user from Redis using the decoded token ID
    const user = await redis.get(decoded.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Attach the user information to the request object
    req.user = JSON.parse(user);
    next();
});


// Role basic logout and login 

export const authorizeRoles=(...roles:string[])=>{
    return  (req:Request,res:Response,next:NextFunction)=>{
if(roles.includes(req.user?.role || ''))
    {
        return next (new ErrorHandler(`Role :${req.user?.role} is not allowed  to access  this resource `,403))
    }

    }
}