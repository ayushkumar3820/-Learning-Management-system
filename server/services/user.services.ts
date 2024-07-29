import userModel from "../model/user.model";
import { NextFunction, Response,Request } from "express";
import { redis } from "../utils/redis";

export const getUserById=async(id:string  ,res:Response)=>{
  const userJson=await redis.get(id);
  if(userJson){
    const user =JSON.parse(userJson);
  
  res.status(201).json({
    success:true,
    user
  })
  }
}


//Get All  Users
export const getAllUserServices=async(res:Response)=>{
  const user=await userModel.find().sort({carateAt:-1})
  res.status(201).json({
    success:true,
  user
  })
}


//update user Role 
export const updateUserRoleServices=async(id:string,role:string,res:Response)=>{
  const user=await userModel.findByIdAndUpdate(id,{role},{new:true})
  res.status(201).json({
    success:true,
    user
    })
    }
    