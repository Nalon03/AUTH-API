import { User, UserRole } from "./user";

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  success?: boolean;
  user: User;
}

export interface JwtPayload {
  id: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
