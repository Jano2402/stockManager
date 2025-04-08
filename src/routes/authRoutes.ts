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
const verifyToken = (token: string, res: Response): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    console.error("Authentication error: ", err);
    res.status(403).json({ error: "You don't have access to this resource" });
    return null;
  }
};

// Middleware para autenticar el token
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const decodedToken = verifyToken(token, res);
  if (decodedToken) {
    console.log(decodedToken);
    next();
  }
};

// Middleware para autenticar si el usuario es admin
export const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const decodedToken = verifyToken(token, res);
  if (decodedToken) {
    if (decodedToken.role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "You are not authorized as an admin" });
    }
    console.log(decodedToken);
    next();
  }
};

// Middleware para autenticar si el usuario es admin o moderador
export const authenticateAdminOrModerator = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const decodedToken = verifyToken(token, res);
  if (decodedToken) {
    if (decodedToken.role !== "ADMIN" && decodedToken.role !== "MODERATOR") {
      return res
        .status(403)
        .json({ error: "You don't have access to this resource" });
    }
    console.log(decodedToken);
    next();
  }
};

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;
