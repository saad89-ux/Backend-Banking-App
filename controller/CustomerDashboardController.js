import ComplaintModel from "../models/complaintSchema.js";

// ✅ Customer Dashboard Analytics
export const CustomerDashboard = async (req, res) => {
  try {
    const user = req.user;

    // Total complaints
    const totalComplaints = await ComplaintModel.countDocuments({ createdBy: user._id });

    // Status-wise count
    const statusWiseCount = await ComplaintModel.aggregate([
      { $match: { createdBy: user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Complaint Type count (Complaint vs Fraud)
    const typeWiseCount = await ComplaintModel.aggregate([
      { $match: { createdBy: user._id } },
      { $group: { _id: "$complaintType", count: { $sum: 1 } } }
    ]);

    // Priority-wise count
    const priorityWiseCount = await ComplaintModel.aggregate([
      { $match: { createdBy: user._id } },
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    // Recent complaints (last 5)
    const recentComplaints = await ComplaintModel.find({ createdBy: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('complaintType category status priority createdAt');

    res.status(200).json({
      message: "Dashboard data fetched successfully",
      status: true,
      data: {
        totalComplaints,
        statusWiseCount,
        typeWiseCount,
        priorityWiseCount,
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

// ✅ Get Single Complaint Details for Customer
export const GetComplaintDetails = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const complaint = await ComplaintModel.findOne({
      _id: id,
      createdBy: user._id
    }).populate('bankId', 'bankName bankCode');

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