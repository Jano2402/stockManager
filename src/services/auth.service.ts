import { User } from "../models/user.interface";
import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || "default-secret";

export const generateToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};
