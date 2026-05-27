import { generateToken, generateRefreshToken } from "../services/auth.service";
import { hashPassword, comparePasswords } from "../services/password.service";
import prisma from "../prisma/prisma";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
const REFRESH_JWT_SECRET =
  process.env.REFRESH_JWT_SECRET || "default-refresh-secret";
const isProduction = process.env.NODE_ENV === "production";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  // Validaciones mejoradas
  if (!username?.trim()) {
    res.status(400).json({ error: "Username es requerido" });
    return;
  }
  if (!password?.trim() || password.length < 6) {
    res
      .status(400)
      .json({ error: "Password debe tener al menos 6 caracteres" });
    return;
  }

  try {
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    // Generar tokens
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true, // httpOnly solo en producción
      secure: isProduction, // solo se envía en HTTPS en producción
      sameSite: isProduction ? "none" : "lax", // sameSite más estricto en producción
      path: "/",
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // httpOnly solo en producción
      secure: isProduction, // solo se envía en HTTPS en producción
      sameSite: isProduction ? "none" : "lax", // sameSite más estricto en producción
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    res.status(201).json({ accessToken, refreshToken });
    //res.status(201).json({ message: "Usuario registrado correctamente." });
  } catch (error: any) {
    console.error("Register error:", error);
    if (error.code === "P2002") {
      res.status(409).json({ error: "Username ya registrado" });
    } else {
      res.status(500).json({ error: "Error al registrar usuario" });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username.trim() || !password.trim()) {
    res.status(400).json({ error: "Ambos campos son requeridos." });
  }
  if (!username || !password) {
    res.status(400).json({ error: "Username y password son requeridos" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await comparePasswords(password, user.password))) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    // Generar tokens
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

    res.cookie("accessToken", accessToken, {
      httpOnly: true, // httpOnly solo en producción
      secure: isProduction, // solo se envía en HTTPS en producción
      sameSite: isProduction ? "none" : "lax", // sameSite más estricto en producción
      path: "/",
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // httpOnly solo en producción
      secure: isProduction, // solo se envía en HTTPS en producción
      sameSite: isProduction ? "none" : "lax", // sameSite más estricto en producción
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    //res.status(201).json({ accessToken, refreshToken });
    res.json({ message: "Login exitoso" });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ error: "Refresh token requerido" });
    return;
  }

  try {
    // 1. Buscar el refresh token en la tabla RefreshToken
    const storedToken = await prisma.refreshToken.findFirst({
      where: { token: refreshToken },
      include: { user: true }, // traemos el usuario asociado
    });

    if (!storedToken) {
      res.status(403).json({ error: "Token inválido" });
      return;
    }

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.status(403).json({ error: "Refresh token expirado" });
      return;
    }
    // 2. Verificar la firma del JWT
    jwt.verify(
      refreshToken,
      REFRESH_JWT_SECRET,
      async (
        err: jwt.VerifyErrors | null,
        decoded: JwtPayload | string | undefined,
      ) => {
        if (err) {
          await prisma.refreshToken.deleteMany({
            where: { token: refreshToken },
          });

          res.clearCookie("accessToken");
          res.clearCookie("refreshToken");

          return res.status(403).json({ error: "Token expirado o inválido" });
        }

        const accessToken = generateToken(storedToken.user);

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          path: "/",
          maxAge: 15 * 60 * 1000,
        });

        res.json({ message: "Access token renovado" });
      },
    );
  } catch (error: any) {
    console.error("Refresh error:", error);
    res.status(500).json({ error: "Error al renovar token" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(400).json({ error: "Refresh token requerido" });
    return;
  }

  try {
    const deleted = await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    if (deleted.count === 0) {
      res.status(404).json({ error: "Token no encontrado" });
      return;
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Sesión cerrada" });
  } catch (error: any) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};
