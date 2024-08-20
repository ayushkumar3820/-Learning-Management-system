"use client";
 import { configureStore } from "@reduxjs/toolkit";
 import { apiSlice } from "./features/api/apiSlice";
import { getDefaultAutoSelectFamily } from "net";
import authSlice from "../redux/features/auth/authSlice";

 export const store=configureStore({
     reducer:{
        [apiSlice.reducerPath]:apiSlice.reducer,
        auth:authSlice,
     },
     devTools: false,
     middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
 })