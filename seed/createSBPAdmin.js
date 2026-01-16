import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import UserModel from "../models/UserSchema.js";


const createSBPAdmin = async () => {
  await mongoose.connect("mongodb+srv://saadkamran574_db_user:ronaldo123@cluster0.nxbjxdq.mongodb.net/?appName=Cluster0");

  const adminExists = await UserModel.findOne({ role: "sbp_admin" });
  if (adminExists) {
    console.log("SBP Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await UserModel.create({
    name: "SBP Super Admin",
    email: "admin@sbp.gov.pk",
    password: hashedPassword,
    role: "sbp_admin",
  });

  console.log("SBP Admin created successfully");
  process.exit();
};

createSBPAdmin();
