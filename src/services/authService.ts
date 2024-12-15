import { AppDataSource } from "../config/db";
import { User } from "../models/User";
import { hashPassword, comparePassword } from "../utils/hashUtils";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils";
import { AuthTokens } from "../types/auth";
import { Role } from "../models/Role";
import { UserRole } from "../types/user";

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<User> => {
  const userRepo = AppDataSource.getRepository(User);
  const roleRepo = AppDataSource.getRepository(Role);

  const existingUser = await userRepo.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await hashPassword(password);
  const userRole = await roleRepo.findOne({ where: { name: "user" } });

  if (!userRole) {
    throw new Error("User role not found");
  }

  const user = userRepo.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    roles: [userRole],
  });

  return userRepo.save(user);
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthTokens> => {
  const userRepo = AppDataSource.getRepository(User);

  const user = await userRepo.findOne({
    where: { email },
    relations: ["roles"],
  });

  if (!user || !(await comparePassword(password, user.password))) {
    throw new Error("Invalid email or password");
  }

  const userRoles: UserRole[] = user.roles.map((role) => role.name as UserRole);
  const accessToken = generateAccessToken(user.id, userRoles);
  const refreshToken = generateRefreshToken(user.id);

  return { accessToken, refreshToken, user: { ...user, roles: userRoles } };
};
