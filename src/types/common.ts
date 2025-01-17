import { Request } from "express";
import { UserRole } from "./user";
export interface ParamsWithUserId {
  userId: string;
}
export interface UpdateUserRoleBody {
  userId: string;
  newRoles: string[];
}
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface CustomError extends Error {
  statusCode?: number;
}

export interface SuccessResponse<T> {
  success: boolean;
  data: T;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
}
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole[];
    iat?: number;
    exp?: number;
  };
}
export interface UpdateUserProfileRequest extends Request<
  Record<string, any>,
  any,                
  {                    
    firstName?: string;
    lastName?: string;
    email?: string;
  }
> {
  user?: {
    id: string;
    role: UserRole[];
    iat?: number;
    exp?: number;
  };
}


