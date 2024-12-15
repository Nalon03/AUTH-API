import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserRole } from "../types/user";

export const generateAccessToken = (id: string, roles: UserRole[]): string => {
  return jwt.sign({ id, roles }, env.JWT_ACCESS_SECRET, { expiresIn: "24h" });
};

export const generateRefreshToken = (id: string): string => {
  return jwt.sign({ id }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error("Token is invalid or expired");
  }
};
