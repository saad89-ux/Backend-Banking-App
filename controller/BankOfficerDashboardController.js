import ComplaintModel from "../models/complaintSchema.js";

// ✅ Bank Officer Dashboard Analytics
export const BankOfficerDashboard = async (req, res) => {
  try {
    const bankId = req.user.bankId;

    // Total complaints for this bank
    const totalComplaints = await ComplaintModel.countDocuments({ bankId });

    // Status-wise count
    const statusWiseCount = await ComplaintModel.aggregate([
      { $match: { bankId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Pending vs Resolved
    const pendingCount = await ComplaintModel.countDocuments({ 
      bankId, 
      status: { $in: ["pending", "inProgress"] } 
    });
    
    const resolvedCount = await ComplaintModel.countDocuments({ 
      bankId, 
      status: "resolved" 
    });

    // Complaint Type Distribution
    const typeWiseCount = await ComplaintModel.aggregate([
      { $match: { bankId } },
      { $group: { _id: "$complaintType", count: { $sum: 1 } } }
    ]);

    // Priority Distribution
    const priorityWiseCount = await ComplaintModel.aggregate([
      { $match: { bankId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    // Category-wise Distribution
    const categoryWiseCount = await ComplaintModel.aggregate([
      { $match: { bankId } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // Recent complaints (last 10)
    const recentComplaints = await ComplaintModel.find({ bankId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('complaintType category status priority createdAt BankofficerRemarks');

    res.status(200).json({
      message: "Dashboard data fetched successfully",
      status: true,
      data: {
        totalComplaints,
        pendingCount,
        resolvedCount,
        statusWiseCount,
        typeWiseCount,
        priorityWiseCount,
        categoryWiseCount,
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

// ✅ Get Single Complaint Details (for Bank Officer)
export const GetComplaintDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const bankId = req.user.bankId;

    const complaint = await ComplaintModel.findOne({
      _id: id,
      bankId: bankId
    })
      .populate('createdBy', 'name email')
      .populate('bankId', 'bankName bankCode');

    if (!complaint) {
      return res.status(403).json({
        message: "Complaint not found or unauthorized access",
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