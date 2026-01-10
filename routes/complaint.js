import express from "express";
import { GenerateComplaint, MyComplaints } from "../controller/complaincontroller.js";
import { CustomerDashboard, GetComplaintDetails } from "../controller/CustomerDashboardController.js";
import { customerAuth } from "../middlewares/customerAuth.js";

const router = express.Router();

// ✅ EXISTING ROUTES (Don't touch these)
router.post("/generate", customerAuth, GenerateComplaint);
router.get("/me", customerAuth, MyComplaints);

// ✅ NEW ROUTES (Add these)
router.get("/dashboard", customerAuth, CustomerDashboard);
router.get("/details/:id", customerAuth, GetComplaintDetails);

export default router;