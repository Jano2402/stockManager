import { User } from "../models/user.interface";
import jwt from "jsonwebtoken";

// Desinstalar si no las uso más
import crypto from "crypto"; // Para generar refresh tokens únicos
import bcrypt from "bcrypt";

const JWT_SECRET: string = process.env.JWT_SECRET || "default-secret";

// Genera el access token (válido por 1h como en tu código)
export const generateToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
};

// Genera un refresh token (único, válido por 7 días)
export const generateRefreshToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
};
