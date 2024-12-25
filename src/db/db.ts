import mongoose from 'mongoose';
import { DB_NAME } from '../constants';

const connectDB = async (): Promise<void> => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDB connected successfully, DB HOST: ${connectionInstance.connection.host}`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("MongoDB connection error:", error);
        } else {
            console.log("Unknown MongoDB connection error");
        }
        process.exit(1);
    }
};

export default connectDB;
