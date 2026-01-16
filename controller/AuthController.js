import UserModel from "../models/UserSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()
export const signupController = async (req, res) => {
  try {
    const { name, email, password, role, bankId } = req.body;

    if (!name || !email || !password || !bankId) {
      return res.status(400).json({ message: "Missing fields", status: false });
    }

    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email exists", status: false });
    }

    const hashPassword = await bcryptjs.hash(password, 10);

    const data = await UserModel.create({
      name,
      email,
      password: hashPassword,
      role: role || "customer",

      bankId,
    });

    res.status(201).json({ message: "User created", status: true, data });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials", status: false });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials", status: false });
    }

    delete user.password;

    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
      expiresIn: "24h",
    });

    res.json({ message: "Login successful", status: true, data: user, token });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};
