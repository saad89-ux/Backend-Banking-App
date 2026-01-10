import express from "express";
import SBPAdminAuth from "../middlewares/SBPAdminAuth.js";
import {
  CreateBankOfficer,
  GetAllBankOfficers,
  UpdateBankOfficer,
  DeleteBankOfficer,
  GetBankOfficerDetails,
} from "../controller/AdminController.js";

const AdminRoute = express.Router();

// ✅ Bank Officer Management (Only SBP Admin)
AdminRoute.post("/create-officer", SBPAdminAuth, CreateBankOfficer);
AdminRoute.get("/officers", SBPAdminAuth, GetAllBankOfficers);
AdminRoute.get("/officer/:id", SBPAdminAuth, GetBankOfficerDetails);
AdminRoute.put("/officer/:id", SBPAdminAuth, UpdateBankOfficer);
AdminRoute.delete("/officer/:id", SBPAdminAuth, DeleteBankOfficer);

export default AdminRoute;