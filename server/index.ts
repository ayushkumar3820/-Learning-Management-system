import express, { NextFunction, Request, Response } from 'express';
require("dotenv").config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Errormiddleware } from './middelware/Error';
import userRouter from './routes/user.router';
import couserRouter from './routes/couser.router';
import orderRouter from './routes/order.router';
import notificationRouter from './routes/notification.router';
import analyticsRouter from './routes/analytices.router';
import LayoutRouter from './routes/layout.router';

export const app = express();

// Middleware to parse JSON payloads and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
// const corsOptions = {
//   origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.ORIGIN, 
//   credentials: true, 
//   optionsSuccessStatus: 200,
// };

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials:true,
}));

// Mount the user routes
app.use("/api/v1", userRouter, couserRouter, orderRouter, notificationRouter, analyticsRouter, LayoutRouter);

// Testing API
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is working fine",
  });
});


app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found `) as any;
  err.status = 404;
  next(err);
});


app.use(Errormiddleware);
