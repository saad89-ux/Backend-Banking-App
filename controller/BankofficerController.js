import ComplaintModel from "../models/complaintSchema.js";
import UserModel from "../models/UserSchema.js";

const GetComplaints = async (req, res) => {
  try {
    const bankId = req.user.bankId;

    const complaints = await ComplaintModel.find({ bankId });

    res.status(200).json({
      message: "Complaints fetched successfully",
      data: complaints,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
      status: false,
    });
  }
};




const UpdateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, BankofficerRemarks } = req.body;
    const bankId = req.user.bankId;

    // 1️⃣ Check complaint belongs to officer's bank
    const complaint = await ComplaintModel.findOne({
      _id: id,
      bankId: bankId
    });

    if (!complaint) {
      return res.status(403).json({
        message: "You are not authorized to update this complaint",
        status: false,
      });
    }

    // 2️⃣ Update complaint
    const updatedComplaint = await ComplaintModel.findByIdAndUpdate(
      id,
      { status, BankofficerRemarks },
      { new: true }
    );

    res.status(200).json({
      message: "Complaint Updated Successfully!",
      data: updatedComplaint,
      status: true,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
      status: false,
    });
  }
};




    


export {GetComplaints,UpdateComplaint} ;
