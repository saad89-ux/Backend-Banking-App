import ComplaintModel from "../models/complaintSchema.js";
import BankModel from "../models/bankSchema.js";
import UserModel from "../models/UserSchema.js";

// ✅ SBP Admin Dashboard Analytics
export const SBPAdminDashboard = async (req, res) => {
  try {
    // Total complaints system-wide
    const totalComplaints = await ComplaintModel.countDocuments({});

    // Fraud vs Non-Fraud Ratio
    const fraudCount = await ComplaintModel.countDocuments({ complaintType: "Fraud" });
    const normalComplaintCount = await ComplaintModel.countDocuments({ complaintType: "Complaint" });

    // Status-wise Distribution (System-wide)
    const statusWiseCount = await ComplaintModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Category-wise Analysis
    const categoryWiseCount = await ComplaintModel.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // Priority Distribution
    const priorityWiseCount = await ComplaintModel.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    // Bank-wise Comparison
    const bankWiseComplaints = await ComplaintModel.aggregate([
      {
        $group: {
          _id: "$bankId",
          totalComplaints: { $sum: 1 },
          pendingComplaints: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          inProgressComplaints: {
            $sum: { $cond: [{ $eq: ["$status", "inProgress"] }, 1, 0] }
          },
          resolvedComplaints: {
            $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] }
          },
          fraudCases: {
            $sum: { $cond: [{ $eq: ["$complaintType", "Fraud"] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: "banks",
          localField: "_id",
          foreignField: "_id",
          as: "bankDetails"
        }
      },
      { $unwind: "$bankDetails" },
      {
        $project: {
          bankName: "$bankDetails.bankName",
          bankCode: "$bankDetails.bankCode",
          totalComplaints: 1,
          pendingComplaints: 1,
          inProgressComplaints: 1,
          resolvedComplaints: 1,
          fraudCases: 1
        }
      }
    ]);

    // Total Banks
    const totalBanks = await BankModel.countDocuments({});

    // Total Customers
    const totalCustomers = await UserModel.countDocuments({ role: "customer" });

    // Total Bank Officers
    const totalBankOfficers = await UserModel.countDocuments({ role: "bank_officer" });

    // Recent complaints (last 20)
    const recentComplaints = await ComplaintModel.find({})
      .populate('createdBy', 'name email')
      .populate('bankId', 'bankName bankCode')
      .sort({ createdAt: -1 })
      .limit(20)
      .select('complaintType category status priority createdAt');

    res.status(200).json({
      message: "SBP Admin Dashboard data fetched successfully",
      status: true,
      data: {
        totalComplaints,
        fraudCount,
        normalComplaintCount,
        fraudRatio: totalComplaints > 0 ? ((fraudCount / totalComplaints) * 100).toFixed(2) : 0,
        totalBanks,
        totalCustomers,
        totalBankOfficers,
        statusWiseCount,
        categoryWiseCount,
        priorityWiseCount,
        bankWiseComplaints,
        recentComplaints
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
      data: null,
    });
  }
};

// ✅ Get Single Complaint Details (for SBP Admin)
export const GetComplaintDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await ComplaintModel.findById(id)
      .populate('createdBy', 'name email')
      .populate('bankId', 'bankName bankCode');

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
        status: false,
      });
    }

    res.status(200).json({
      message: "Complaint details fetched",
      status: true,
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
      data: null,
    });
  }
};

// ✅ Get Fraud Trends (Monthly/Yearly)
export const GetFraudTrends = async (req, res) => {
  try {
    const fraudTrends = await ComplaintModel.aggregate([
      { $match: { complaintType: "Fraud" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      message: "Fraud trends fetched successfully",
      status: true,
      data: fraudTrends
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
      data: null,
    });
  }
};