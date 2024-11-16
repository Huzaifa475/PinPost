import mongoose from "mongoose";
import {DB_NAME} from "../constant.js"
import dotenv from "dotenv"

dotenv.config({
    path: './.env'
})

const MONGODB_URL = process.env.MONGODB_URL;

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${MONGODB_URL}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB host ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDB;