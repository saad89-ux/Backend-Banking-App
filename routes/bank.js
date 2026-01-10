import express from "express";
import { AddBankController, BankDropdownController } from "../controller/BankRoute.js";
import SBPAdminAuth from "../middlewares/SBPAdminAuth.js"
const router = express.Router();

router.post("/add",SBPAdminAuth, AddBankController);
router.get("/dropdown", BankDropdownController);

export default router;
