import express from "express";
import { isAuthication,authorizeRoles } from "../middelware/auth";
import { createLayout } from "../controller/layout.controller";
const LayoutRouter=express.Router();

LayoutRouter.post("/createLayoutPart",isAuthication,authorizeRoles("user"),createLayout);

export default LayoutRouter;