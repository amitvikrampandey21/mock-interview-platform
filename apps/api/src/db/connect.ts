import mongoose from "mongoose";
import { env } from "../config/env.js";

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.warn("MongoDB connection failed, falling back to in-memory data.");
    console.warn(error);
  }
}
