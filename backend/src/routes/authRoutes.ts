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
import { RequestHandler } from "express";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

// Middleware para autenticar el token
export const authenticateToken: RequestHandler = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(401).json({ error: "Not authorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};

// Middleware para autenticar si el usuario es admin
export const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = (req as any).user;

  if (!user) return res.status(401).json({ error: "Not authenticated" });

  if (user.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
};

// Middleware para autenticar si el usuario es admin o moderador
export const authenticateAdminOrModerator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = (req as any).user;

  if (!user) return res.status(401).json({ error: "Not authenticated" });

  if (!["ADMIN", "MODERATOR"].includes(user.role)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
};
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
