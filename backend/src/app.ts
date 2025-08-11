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

// Configuración de CORS (permitir localhost y un dominio de producción)
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://mi-app.com",
  ], // Lista de dominios permitidos
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  allowedHeaders: ["Content-Type"], // Encabezados permitidos
};

// Usar CORS con la configuración
app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 solicitudes por IP
  message:
    "Demasiadas solicitudes desde esta IP, por favor inténtelo de nuevo más tarde.",
});

// Usar el rate limiter para todas las solicitudes
app.use(limiter);

// Usa todos los middlewares de seguridad que proporciona helmet
app.use(helmet());

// Logs en consola (formato 'dev' o 'combined')
app.use(morgan("dev"));

// Logs en un archivo
const accessLogStream = fs.createWriteStream("./access.log", { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));

// JSON understanding
app.use(express.json());

// Simplifies woking with cookies
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/app", authenticateToken, appRoutes);

export default app;
