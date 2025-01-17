import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { UserRole } from "../types/user";

interface CustomJwtPayload extends JwtPayload {
  id: string;
  roles?: UserRole[];
}

export const generateAccessToken = (id: string, roles: UserRole[]): string => {
  return jwt.sign(
    { id, roles }, 
    env.JWT_ACCESS_SECRET, 
    { 
      expiresIn: "2h",
      algorithm: "HS256"
    }
  );
};

export const generateRefreshToken = (id: string): string => {
  return jwt.sign(
    { id }, 
    env.JWT_REFRESH_SECRET, 
    { 
      expiresIn: "7d",
      algorithm: "HS256"
    }
  );
};

export const verifyToken = (token: string, secret: string): CustomJwtPayload => {
  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ['HS256']
    }) as CustomJwtPayload;

    if (!decoded.id) {
      throw new Error("Invalid token payload");
    }

    return decoded;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new Error("Token has expired");
    } else if (err instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    } else {
      throw new Error("Token verification failed");
    }
  }
};