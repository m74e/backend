import mongoose from "mongoose";
import {PORT,NODE_ENV,DB_URI } from "../config/env.js";

if(!DB_URI){
    throw new Error("DB_URI is not defined in the environment variables");
}

const connectDB = async () => {
    try{
        await mongoose.connect(DB_URI);
    console.log(`Connected to MongoDB at ${DB_URI} in ${NODE_ENV} mode`);
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); 
    }
}

export default connectDB;