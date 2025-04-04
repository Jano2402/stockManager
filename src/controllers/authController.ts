import { generateToken } from "../services/auth.service";
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
    if (!username) {
      res.status(400).json({ message: "username is required" });
      return;
    }
    if (!password) {
      res.status(400).json({ message: "password is required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "User/password doesn't match" });
      return;
    }
    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error: any) {
    console.log("Error", error);
  }
};
