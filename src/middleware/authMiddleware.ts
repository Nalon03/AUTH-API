import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/tokenUtils";
import { env } from "../config/env";
import { JwtPayload } from "../types/auth";
import { User } from "../models/User";
import { AppDataSource } from "../config/db";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = verifyToken(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(403).json({ message: "Invalid token" });
  }
};

export const authorizeRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).json({ message: "Forbidden - No user found" });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: req.user.id },
      relations: ["roles"],
    });

    if (!user) {
      return res.status(403).json({ message: "Forbidden - User not found" });
    }

    if (!user.roles.some((role) => roles.includes(role.name))) {
      return res
        .status(403)
        .json({ message: "Forbidden - Insufficient permissions" });
    }

    next();
  };
};

export const isAdmin = authorizeRole(["admin"]);
