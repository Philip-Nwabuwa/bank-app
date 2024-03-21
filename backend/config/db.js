import mongoose from "mongoose";

const connectDB = async () => {
  const MongoUri = process.env.MONGO_URI;
  if (!MongoUri) {
    console.error("MONGO_URI not found");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(MongoUri);
    console.log("MongoDB Connected: ", conn.connection.host);
  } catch (error) {
    console.error("Error: ", error.message);
    process.exit(1);
  }
};

export default connectDB;
