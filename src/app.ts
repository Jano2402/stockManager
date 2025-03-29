import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// JSON understanding
app.use(express.json());

// Routes
app.use("/auth", () => {});
app.use("/app", () => {});

console.log("funca");

export default app;
