import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes";
import appRoutes from "./routes/appRoutes";
import { authenticateToken } from "./routes/authRoutes";

const app = express();

// Configuración de CORS (permitir localhost y un dominio de producción)
const corsOptions = {
  origin: ["http://localhost:3000", "https://mi-app.com"], // Lista de dominios permitidos
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

// JSON understanding
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/app", authenticateToken, appRoutes);

export default app;
