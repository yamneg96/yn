import mongoose from "mongoose";
import { env } from "./env";

export async function connectDb() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  return mongoose.connection;
}

export async function disconnectDb() {
  await mongoose.connection.close();
}
