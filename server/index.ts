import express, { NextFunction, Request, Response } from 'express';
require("dotenv").config();
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { Errormiddleware } from './middelware/Error';
import userRouter from './routes/user.router';

export const app = express();

//body parser
app.use(bodyParser.json()); // Add this line to parse JSON payloads
app.use(bodyParser.urlencoded({ extended: true })); // Optional, for parsing URL-encoded data
app.use(cookieParser());
app.use(cors({ origin: process.env.ORIGIN }));

// Mount the user routes
app.use("/api/v1", userRouter);

// Testing API
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "API is working fine"
    });
});

// Handle unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Router ${req.originalUrl} not found `) as any;
    err.status = 404;
    next(err);
});

// Error middleware
app.use(Errormiddleware);
