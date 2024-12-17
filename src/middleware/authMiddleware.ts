import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/tokenUtils";
import { env } from "../config/env";
import { JwtPayload } from "../types/auth";
import { User } from "../models/User";
import { AppDataSource } from "../config/db";
import { UserRole } from "../types/user";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["Authorization"];

  console.log(`Raw Authorization Header: ${authHeader}`);

  if (!authHeader) {
    return res.status(401).json({
      message: "Unauthorized: No authorization header",
      details: "Authorization header is missing",
    });
  }

  const normalizedHeader = authHeader.toString().trim();

  const tokenMatch = normalizedHeader.match(/^Bearer\s+(.+)$/i);

  if (!tokenMatch) {
    return res.status(401).json({
      message: "Unauthorized: Invalid authorization header format",
      details: "Header must start with 'Bearer ' followed by token",
    });
  }

  const token = tokenMatch[1].trim();

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: Token is empty",
      details: "No token provided after 'Bearer '",
    });
  }

  try {
    const decoded = verifyToken(token, env.JWT_ACCESS_SECRET) as JwtPayload;

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        message: "Unauthorized: Invalid token payload",
        details: "Token is missing required information",
      });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: decoded.id },
      relations: ["roles"],
    });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: User not found",
        details: `No user exists with ID ${decoded.id}`,
      });
    }

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
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token expired",
          details: "The provided token has expired",
        });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: "Invalid token",
          details: "The token could not be verified",
        });
      }

      return res.status(403).json({
        message: "Authentication error",
        details: error.message,
      });
    } else {
      return res.status(403).json({
        message: "Unexpected authentication error",
        details: "An unknown error occurred during authentication",
      });
    }
  }
};

export const authorizeRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).json({ message: "Forbidden - No user found" });
    }

    if (!req.user.role.some((roleName) => roles.includes(roleName))) {
      return res
        .status(403)
        .json({ message: "Forbidden - Insufficient permissions" });
    }

    next();
  };
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !req.user.role.includes("admin")) {
    return res.status(403).json({ message: "Forbidden - Admins only" });
  }
  next();
};

export const isAdmin = authorizeRole(["admin"]);
