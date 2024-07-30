import express from "express";
import { isAuthication,authorizeRoles } from "../middelware/auth";
import { createLayout,editLayout,getLayout } from "../controller/layout.controller";
const LayoutRouter=express.Router();

LayoutRouter.post("/createLayoutPart",isAuthication,authorizeRoles("user"),createLayout);
LayoutRouter.put("/editLayout ",isAuthication,authorizeRoles("user"),editLayout);
LayoutRouter.get("/getLayout",isAuthication,getLayout);
export default LayoutRouter;