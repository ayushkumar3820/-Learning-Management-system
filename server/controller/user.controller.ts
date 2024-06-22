require("dotenv").config();
import userModel, { IUser } from "../model/user.model";
import ErrorHandler from "../utils/ErrorHandle";
import { CatchAsyncError } from "../middelware/CatchAsyncError";
import jwt, { Secret } from "jsonwebtoken";
import ejs from 'ejs';
import path from "path";
import { NextFunction, Response, Request } from "express";
import sendMail from "../utils/sendMail";
import { sendToken } from "../utils/jwt";

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
    // console.log("Activation Code:", activationCode); // Log activation code
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
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error: any) {
        next(new ErrorHandler(error.message, 400));
    }
});
