import * as express from "express";
import { JwtPayload } from "../types/auth";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        iat?: number;
        exp?: number;
      };
    }
  }
}
