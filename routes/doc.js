import express from "express";
import { customerAuth } from "../middlewares/customerAuth.js";
import { upload } from "../middlewares/Multer.js";
import { cloudinaryUploader } from "../config/cloudinary.js";

const docRoute = express.Router();

docRoute.post(
  "/upload",
  customerAuth,
  upload.any(), // accepts multiple files
  async (req, res) => {
    try {
      const docCollection = req.files;

      if (!docCollection || docCollection.length === 0) {
        return res.status(400).json({
          message: "No files uploaded",
          status: false,
        });
      }

      console.log("Uploaded files:", docCollection);

      const fileArr = [];

      for (const file of docCollection) {
        const uploadedFile = await cloudinaryUploader.upload(file.path);
        fileArr.push(uploadedFile);
      }

      return res.status(200).json({
        message: "Files uploaded successfully",
        status: true,
        data: fileArr,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        status: false,
      });
    }
  }
);

export default docRoute;
