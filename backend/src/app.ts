import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import helmet from "helmet";
import fs from "fs";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes";
import appRoutes from "./routes/appRoutes";
import { authenticateToken } from "./routes/authRoutes";

const app = express();

const isProduction = process.env.NODE_ENV === "production";

// Configuración de CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 100 : 1000,
  message:
    "Demasiadas solicitudes desde esta IP, por favor inténtelo más tarde.",
});

app.use(limiter);

// Seguridad HTTP
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

// Logs
if (!isProduction) {
  app.use(morgan("dev"));
} else {
  const accessLogStream = fs.createWriteStream("./access.log", {
    flags: "a",
  });

  app.use(morgan("combined", { stream: accessLogStream }));
}

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/app", authenticateToken, appRoutes);

export default app;
