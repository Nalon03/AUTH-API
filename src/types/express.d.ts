import { Request } from "express";
import { UserRole } from "./user"; // Adjust the import path as necessary

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole[]; 
        iat?: number;
        exp?: number;
      };
    }
  }
}
