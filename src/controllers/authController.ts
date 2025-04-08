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
  try {
    if (!username) {
      res.status(400).json({ message: "username is required" });
      return;
    }
    if (!password) {
      res.status(400).json({ message: "password is required" });
      return;
    }
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("username")) {
      res.status(400).json({ error: "The username is already taken" });
    }
    res.status(500).json({ error: "There was an error singing up" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    // Validaciones (como en tu código actual)
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await comparePasswords(password, user.password))) {
      res.status(401).json({ message: "Credenciales inválidas" });
      return;
    }

    // Generar tokens
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken();
    const hashedRefreshToken = await hashRefreshToken(refreshToken);

    // Guardar refresh token en DB
    await prisma.refreshToken.create({
      data: {
        token: hashedRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      },
    });

    res.status(200).json({ accessToken, refreshToken }); // Enviar refreshToken sin hashear al cliente
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
    // Buscar todos los tokens del usuario (para comparar)
    const userTokens = await prisma.refreshToken.findMany({
      where: { expiresAt: { gt: new Date() } }, // Solo tokens no expirados
      include: { user: true },
    });

    // Comparar el token recibido con los hasheados en DB
    let validToken = null;
    for (const tokenRecord of userTokens) {
      if (await compareRefreshTokens(refreshToken, tokenRecord.token)) {
        validToken = tokenRecord;
        break;
      }
    }

    if (!validToken) {
      res.status(403).json({ error: "Refresh token inválido o expirado" });
      return;
    }

    // Generar nuevos tokens
    const newAccessToken = generateToken(validToken.user);
    const newRefreshToken = generateRefreshToken();
    const newHashedRefreshToken = await hashRefreshToken(newRefreshToken);

    // Rotar tokens: eliminar el antiguo y guardar el nuevo
    await prisma.$transaction([
      prisma.refreshToken.delete({ where: { id: validToken.id } }),
      prisma.refreshToken.create({
        data: {
          token: newHashedRefreshToken,
          userId: validToken.userId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ error: "Refresh token requerido" });
    return;
  }

  try {
    // Buscar y eliminar el refresh token
    const userTokens = await prisma.refreshToken.findMany();
    for (const tokenRecord of userTokens) {
      if (await compareRefreshTokens(refreshToken, tokenRecord.token)) {
        await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
        res.status(200).json({ message: "Sesión cerrada correctamente" });
        return;
      }
    }
    res.status(404).json({ error: "Token no encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};
