import express from "express";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/authRoutes";
import appRoutes from "./routes/appRoutes";

const app = express();

// JSON understanding
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/app", appRoutes);

console.log("funca");

export default app;
