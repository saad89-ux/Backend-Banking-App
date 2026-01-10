import UserModel from "../models/UserSchema.js";
import bcryptjs from "bcryptjs";

// ✅ Create Bank Officer (Only SBP Admin can do this)
export const CreateBankOfficer = async (req, res) => {
  try {
    const { name, email, password, bankId } = req.body;

    // Validate required fields
    if (!name || !email || !password || !bankId) {
      return res.status(400).json({
        message: "All fields are required (name, email, password, bankId)",
        status: false,
      });
    }

    // Check if email already exists
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        message: "Email already exists",
        status: false,
      });
    }

    // Hash password
    const hashPassword = await bcryptjs.hash(password, 10);

    // Create bank officer
    const bankOfficer = await UserModel.create({
      name,
      email,
      password: hashPassword,
      role: "bank_officer",
      bankId,
    });

    // Remove password from response
    const officerData = bankOfficer.toObject();
    delete officerData.password;

    res.status(201).json({
      message: "Bank Officer created successfully",
      status: true,
      data: officerData,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

// ✅ Get All Bank Officers
export const GetAllBankOfficers = async (req, res) => {
  try {
    const { bankId } = req.query;

    let query = { role: "bank_officer" };
    if (bankId) {
      query.bankId = bankId;
    }

    const officers = await UserModel.find(query)
      .select("-password")
      .populate("bankId", "bankName bankCode")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Bank Officers fetched successfully",
      status: true,
      data: officers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

// ✅ Update Bank Officer
export const UpdateBankOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, bankId } = req.body;

    const officer = await UserModel.findOne({ _id: id, role: "bank_officer" });
    
    if (!officer) {
      return res.status(404).json({
        message: "Bank Officer not found",
        status: false,
      });
    }

    // Check if new email already exists (if email is being changed)
    if (email && email !== officer.email) {
      const emailExists = await UserModel.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          message: "Email already exists",
          status: false,
        });
      }
    }

    const updatedOfficer = await UserModel.findByIdAndUpdate(
      id,
      { name, email, bankId },
      { new: true }
    ).select("-password").populate("bankId", "bankName bankCode");

    res.status(200).json({
      message: "Bank Officer updated successfully",
      status: true,
      data: updatedOfficer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

// ✅ Delete Bank Officer
export const DeleteBankOfficer = async (req, res) => {
  try {
    const { id } = req.params;

    const officer = await UserModel.findOne({ _id: id, role: "bank_officer" });
    
    if (!officer) {
      return res.status(404).json({
        message: "Bank Officer not found",
        status: false,
      });
    }

    await UserModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Bank Officer deleted successfully",
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

// ✅ Get Single Bank Officer Details
export const GetBankOfficerDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const officer = await UserModel.findOne({ _id: id, role: "bank_officer" })
      .select("-password")
      .populate("bankId", "bankName bankCode");

    if (!officer) {
      return res.status(404).json({
        message: "Bank Officer not found",
        status: false,
      });
    }

    res.status(200).json({
      message: "Bank Officer details fetched",
      status: true,
      data: officer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};