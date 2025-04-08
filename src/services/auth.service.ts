import { User } from "../models/user.interface";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // Para generar refresh tokens únicos
import bcrypt from "bcrypt";

const JWT_SECRET: string = process.env.JWT_SECRET || "default-secret";

// Genera el access token (válido por 1h como en tu código)
export const generateToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Genera un refresh token (único y no-JWT, válido por 7 días)
export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString("hex");
};

// Hashea el refresh token antes de guardarlo en DB (opcional pero recomendado)
export const hashRefreshToken = async (token: string): Promise<string> => {
  return await bcrypt.hash(token, 10);
};

// Compara un refresh token con su versión hasheada
export const compareRefreshTokens = async (
  token: string,
  hashedToken: string
): Promise<boolean> => {
  return await bcrypt.compare(token, hashedToken);
};
