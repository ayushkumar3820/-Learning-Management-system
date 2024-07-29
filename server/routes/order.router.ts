import express  from "express";
import { authorizeRoles, isAuthication } from "../middelware/auth";
import { createOrder ,getAllOrder} from "../controller/order.controller";
const orderRouter =express.Router();

orderRouter.post("/create-order",isAuthication,createOrder);
orderRouter.get("/getAll-order",isAuthication,authorizeRoles("user"),getAllOrder)


export default orderRouter;
