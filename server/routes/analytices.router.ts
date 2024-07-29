import express from "express";
import { isAuthication ,authorizeRoles} from "../middelware/auth";
import { getUserAnalytics,getCourseAnalytics,getOrderAnalytics } from "../controller/analytics";
const analyticsRouter=express.Router();

analyticsRouter.get("/getAllAnalyticsUser",isAuthication,authorizeRoles("user"),getUserAnalytics);
analyticsRouter.get("/getAllAnalyticsCourse",isAuthication,authorizeRoles("user"),getCourseAnalytics);
analyticsRouter.get("/getAllAnalyticsOrder",isAuthication,authorizeRoles("user"),getOrderAnalytics);
export default analyticsRouter;