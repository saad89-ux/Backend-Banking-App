import express from "express";
import { GetComplaints, UpdateComplaint } from "../controller/BankofficerController.js";
import { BankOfficerDashboard, GetComplaintDetails } from "../controller/BankOfficerDashboardController.js";
import { bankOfficerAuth } from "../middlewares/bankofficerAuth.js";

const bankofficerRoute = express.Router();

// ✅ EXISTING ROUTES (Don't touch these)
bankofficerRoute.get("/get-complaint", bankOfficerAuth, GetComplaints);
bankofficerRoute.put("/updatecomplaint/:id", bankOfficerAuth, UpdateComplaint);

// ✅ NEW ROUTES (Add these)
bankofficerRoute.get("/dashboard", bankOfficerAuth, BankOfficerDashboard);
bankofficerRoute.get("/complaint-details/:id", bankOfficerAuth, GetComplaintDetails);

export default bankofficerRoute;