import mongoose from "mongoose";
import { useRuntimeConfig } from '#imports'

export async function ConnectDB(){
    try {
        mongoose.Promise = global.Promise;
        mongoose.set("strictQuery", false);
        await mongoose.connect(useRuntimeConfig().db_url);
        console.log("Database connected");
      } catch (error) {
        console.error("Database connection error:", error);
      }
}