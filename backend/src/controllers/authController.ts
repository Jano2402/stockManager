import { generateToken, generateRefreshToken } from "../services/auth.service";
import { hashPassword, comparePasswords } from "../services/password.service";
import prisma from "../prisma/prisma";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { cookieOptions } from "../utils/cookies";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
const REFRESH_JWT_SECRET =
  process.env.REFRESH_JWT_SECRET || "default-refresh-secret";
const isProduction = process.env.NODE_ENV === "production";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username?.trim() || !password?.trim() || password.length < 6) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  try {
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const options = cookieOptions(isProduction);

    res.cookie("accessToken", accessToken, {
      ...options,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...options,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "OK" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Register error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username?.trim() || !password?.trim()) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !(await comparePasswords(password, user.password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const options = cookieOptions(isProduction);

    res.cookie("accessToken", accessToken, {
      ...options,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...options,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "OK" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Login error" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    res.status(401).json({ error: "No refresh token" });
    return;
  }

  try {
    const storedToken = await prisma.refreshToken.findFirst({
      where: { token },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(403).json({ error: "Invalid refresh token" });
      return;
    }

    jwt.verify(token, REFRESH_JWT_SECRET);

    const newAccessToken = generateToken(storedToken.user);

    const options = cookieOptions(isProduction);

    res.cookie("accessToken", newAccessToken, {
      ...options,
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "refreshed" });
  } catch (e) {
    res.status(403).json({ error: "Refresh failed" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (token) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }

  const options = cookieOptions(isProduction);

  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);

  res.json({ message: "logged out" });
};
