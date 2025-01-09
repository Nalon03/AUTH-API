import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/tokenUtils";
import { env } from "../config/env";
import { JwtPayload } from "../types/auth";
import { User } from "../models/User";
import { AppDataSource } from "../config/db";
import { UserRole } from "../types/user";
import { AuthenticatedRequest } from "@/types/common";

const unauthorizedResponse = (res: Response, message: string) => {
  return res.status(401).json({ message });
};

const forbiddenResponse = (res: Response, message: string) => {
  return res.status(403).json({ message });
};

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("authorization");
  if (!authHeader) return unauthorizedResponse(res, "Unauthorized");

  const tokenPrefix = "Bearer ";
  if (!authHeader.startsWith(tokenPrefix))
    return unauthorizedResponse(res, "Unauthorized");

  const token = authHeader.slice(tokenPrefix.length).trim();
  if (!token) return unauthorizedResponse(res, "Unauthorized");

  try {
    const decoded = verifyToken(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    if (!decoded || !decoded.id)
      return unauthorizedResponse(res, "Unauthorized");

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: decoded.id },
      relations: ["roles"],
    });

    if (!user) return unauthorizedResponse(res, "User not found");

    req.user = {
      id: user.id,
      role: user.roles.map((role) => role.name as UserRole),
      iat: decoded.iat,
      exp: decoded.exp,
    };

    next();
  } catch (error) {
    console.error("Authentication Error:", {
      name: error instanceof Error ? error.name : "Unknown Error",
      message: error instanceof Error ? error.message : "No error message",
      stack: error instanceof Error ? error.stack : "No stack trace",
    });

    if (error instanceof Error) {
      switch (error.name) {
        case "TokenExpiredError":
          return unauthorizedResponse(res, "Token expired");
        case "JsonWebTokenError":
          return unauthorizedResponse(res, "Invalid token");
        default:
          return forbiddenResponse(res, "Authentication error");
      }
    }

    return forbiddenResponse(res, "Unexpected authentication error");
  }
};

export const authorizeRole = (roles: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) return forbiddenResponse(res, "Forbidden - No user found");

    if (!req.user.role.some((roleName) => roles.includes(roleName))) {
      return forbiddenResponse(res, "Forbidden - Insufficient permissions");
    }

    next();
  };
};

export const authorizeAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !req.user.role.includes("admin")) {
    return forbiddenResponse(res, "Forbidden - Admins only");
  }

  next();
};

export const isAdmin = authorizeRole(["admin"]);
