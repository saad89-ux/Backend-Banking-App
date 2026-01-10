import ComplaintModel from "../models/complaintSchema.js";


const GetAllComplaint = async (req,res)=>{
    try {
        const {bankId} = req.query ;
        if(bankId){
            const complaint = await ComplaintModel.find({bankId});
          return res.status(200).json({
                message : "Complaint Fetched Successfully!",
                data : complaint,

            })
        }
        const Allcomplaint = await ComplaintModel.find({});
        return res.status(200).json({
             message : "Complaint Fetched Successfully!",
            data : Allcomplaint,
        })
    } catch (error) {
        res.status(500).json({
            message : "Permission Denied" || error.message,
            data : null,

        })
    }
}

 
export default GetAllComplaint