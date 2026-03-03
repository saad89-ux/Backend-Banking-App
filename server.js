import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import DBConfig from "./config/Dbconfig.js";
import { cloudinaryConfig } from "./config/cloudinary.js";
import helmet from "helmet";

import authRoute from "./routes/auth.js";
import bankRoute from "./routes/bank.js";
import complaintRoute from "./routes/complaint.js";
import docRoute from "./routes/doc.js";
import SBPAdminRoute from "./routes/SBPAdminRoute.js";
import bankofficerRoute from "./routes/bankofficerroute.js";
import AdminRoute from "./routes/AdminRoute.js"; // ✅ NEW IMPORT

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
  origin: ["https://bankwise-connect.vercel.app", "http://localhost:3000"],
  credentials: true,
}));

app.use(helmet());

DBConfig();
cloudinaryConfig();

app.use("/api/auth", authRoute);
app.use("/api/bank", bankRoute);
app.use("/api/complaint", complaintRoute);
app.use("/api/doc", docRoute);

/* Bank-Officer Routes */
app.use("/api/bank-officer", bankofficerRoute);

/* SBP_Admin Routes */
app.use("/api/sbpAdmin", SBPAdminRoute);

/* Admin Routes - Bank Officer Management */
app.use("/api/admin", AdminRoute); // ✅ NEW ROUTE

app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);