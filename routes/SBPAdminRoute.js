import express from "express";
import SBPAdminAuth from "../middlewares/SBPAdminAuth.js";
import GetAllComplaint from "../controller/SBPAdminController.js";
import { SBPAdminDashboard, GetComplaintDetails, GetFraudTrends } from "../controller/SBPDashboardController.js";

const SBPAdminRoute = express.Router();

// ✅ EXISTING ROUTE (Don't touch this)
SBPAdminRoute.get("/getAll-complaint", SBPAdminAuth, GetAllComplaint);

// ✅ NEW ROUTES (Add these)
SBPAdminRoute.get("/dashboard", SBPAdminAuth, SBPAdminDashboard);
SBPAdminRoute.get("/complaint-details/:id", SBPAdminAuth, GetComplaintDetails);
SBPAdminRoute.get("/fraud-trends", SBPAdminAuth, GetFraudTrends);

export default SBPAdminRoute;