export type UserRole = "admin" | "user";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];
  updatedAt?: Date;
}
