
import OrderModel from "../model/OrderModel";
import { CatchAsyncError } from "../middelware/CatchAsyncError";
import { NextFunction,Response } from "express";

export const newOrder=CatchAsyncError(async(data:any,next:NextFunction,res:Response)=>{
    const order=await  OrderModel.create(data);
    
    res.status(201).json({
        success:true,
        order
    })
    
})

//Get All  Users
export const getAllOrderServices=async(res:Response)=>{
    const order=await OrderModel.find().sort({carateAt:-1})
    res.status(201).json({
      success:true,
      order
    })
  }