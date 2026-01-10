import jwt from "jsonwebtoken";
import UserModel from "../models/UserSchema.js";

export const bankOfficerAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token)
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const user = await UserModel.findById(decoded._id);
    if (!user || user.role !== "bank_officer") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};