import { NextFunction, Request, Response } from "express";
import express from "express";
import jwt from "jsonwebtoken";
import {
  login,
  register,
  refreshToken,
  logout,
  me,
} from "../controllers/authController";
import { RequestHandler } from "express";
import { AuthUser, JwtPayload } from "../models/jwt.interface";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

// Middleware para autenticar el token
export const authenticateToken: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(401).json({ error: "Not authorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};

// Middleware para autenticar si el usuario es admin
export const authenticateAdmin: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  if (req.user.role !== "ADMIN") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  next();
};

// Middleware para autenticar si el usuario es admin o moderador
export const authenticateAdminOrModerator: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  if (!["ADMIN", "MODERATOR"].includes(req.user.role)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  next();
};

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/me", authenticateToken, me);

export default router;
