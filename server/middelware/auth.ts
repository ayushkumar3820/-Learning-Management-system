require("dotenv").config();
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandle";
import { redis } from "../utils/redis";
import { IUser } from "../model/user.model"; // Adjust path as necessary

interface AuthRequest extends Request {
    user?: IUser;
}

export const isAuthication = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const access_token = req.cookies.access_token as string;

        if (!access_token) {
            console.log("Access token not found");
            return next(new ErrorHandler("Please login to access this resource", 400));
        }

        const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;
        if (!decoded) {
            console.log("Access token is invalid");
            return next(new ErrorHandler("Access token is not valid", 400));
        }

        const user = await redis.get(decoded.id);
        if (!user) {
            console.log("User not found in Redis");
            return next(new ErrorHandler("User not found", 404));
        }

        req.user = JSON.parse(user) as IUser;
        next();
    } catch (error: any) {
        console.log("Error in authentication middleware:", error.message);
        next(new ErrorHandler(error.message, 400));
    }
};



// Role basic logout and login 

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resource`, 403));
      }
      next();
    };
  };