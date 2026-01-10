import mongoose from "mongoose";

const DBConfig = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB successfully connected");
  } catch (error) {
    console.log("MongoDB error:", error.message);
  }
};

export default DBConfig;
