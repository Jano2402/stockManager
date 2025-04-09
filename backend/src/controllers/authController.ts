import {
  generateToken,
  generateRefreshToken,
  hashRefreshToken,
  compareRefreshTokens,
} from "../services/auth.service";
import { hashPassword, comparePasswords } from "../services/password.service";
import prisma from "../prisma/prisma";
import { Request, Response } from "express";

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
    const refreshToken = generateRefreshToken();
    await prisma.refreshToken.create({
      data: {
        token: await hashRefreshToken(refreshToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      },
    });

    res.status(201).json({ accessToken, refreshToken });
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
    const refreshToken = generateRefreshToken();
    await prisma.refreshToken.create({
      data: {
        token: await hashRefreshToken(refreshToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({ error: "Refresh token requerido" });
    return;
  }

  try {
    // Buscar tokens válidos
    const tokens = await prisma.refreshToken.findMany({
      where: { expiresAt: { gt: new Date() } },
      include: { user: true },
    });

    // Comparar tokens
    let validToken = null;
    for (const tokenRecord of tokens) {
      if (await compareRefreshTokens(refreshToken, tokenRecord.token)) {
        validToken = tokenRecord;
        break;
      }
    }

    if (!validToken) {
      res.status(403).json({ error: "Token inválido o expirado" });
      return;
    }

    // Generar nuevos tokens y rotar
    const newAccessToken = generateToken(validToken.user);
    const newRefreshToken = generateRefreshToken();

    await prisma.$transaction([
      prisma.refreshToken.delete({ where: { id: validToken.id } }),
      prisma.refreshToken.create({
        data: {
          token: await hashRefreshToken(newRefreshToken),
          userId: validToken.userId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ error: "Error al renovar token" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ error: "Refresh token requerido" });
    return;
  }

  try {
    const tokens = await prisma.refreshToken.findMany({
      where: { expiresAt: { gt: new Date() } },
    });

    for (const tokenRecord of tokens) {
      if (await compareRefreshTokens(refreshToken, tokenRecord.token)) {
        await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
        res.status(204).end(); // 204 No Content
        return;
      }
    }

    res.status(404).json({ error: "Token no encontrado" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};
