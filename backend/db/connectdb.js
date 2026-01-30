import mongoose from "mongoose";
const connectDb = async () => {
  // console.log(process.env.MONGO_URI);
  try {
    let conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDb Connected`);
  } catch (error) {
    console.error("Fail to connect DB:", error);
  }
};
export default connectDb;
