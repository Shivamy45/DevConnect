import mongoose from "mongoose";
const connectDatabase = () => mongoose.connect(process.env.MONGO_URI);
export default connectDatabase;
