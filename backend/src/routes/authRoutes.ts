import { NextFunction, Request, Response } from "express";
import express from "express";
import jwt from "jsonwebtoken";
import {
  login,
  register,
  refreshToken,
  logout,
} from "../controllers/authController";
import { JwtPayload } from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

// Función auxiliar para verificar y decodificar el token
const verifyCookieToken = (req: Request, res: Response): JwtPayload | null => {
  const token = req.cookies?.accessToken; // 👈 Buscar en cookies
  if (!token) {
    res.status(401).json({ error: "Not authorized" });
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET as string) as JwtPayload;
  } catch {
    return res.status(401).json({ error: "Invalid or expiered token" });
    return null;
  }
};

// Middleware para autenticar el token
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const token = req.cookies?.accessToken; // 👈 Leer token de cookies

  if (!token) {
    res.status(401).json({ error: "Not authorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    // Si querés guardar el payload para usarlo en otros controladores:
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expiered token" }); // Ponemos 401 también para que lo handlee el refresh
  }
};

// Middleware para autenticar si el usuario es admin
export const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const decodedToken = verifyCookieToken(req, res);
  if (!decodedToken) return;

  if (decodedToken.role !== "ADMIN") {
    res.status(403).json({ error: "You are not authorized as an admin" });
    return;
  }

  (req as any).user = decodedToken; // Guardar info para siguientes middlewares
  next();
};

// Middleware para autenticar si el usuario es admin o moderador
export const authenticateAdminOrModerator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const decodedToken = verifyCookieToken(req, res);
  if (!decodedToken) return;

  if (!["ADMIN", "MODERATOR"].includes(decodedToken.role)) {
    res.status(403).json({ error: "You don't have access to this resource" });
    return;
  }

  (req as any).user = decodedToken;
  next();
};

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
