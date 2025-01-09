import { In } from "typeorm";
import { AppDataSource } from "../config/db";
import { User } from "../models/User";
import { Role } from "../models/Role";
import { UserRole } from "../types/user";

export const changeUserRole = async (
  userId: string,
  newRoles: UserRole[]
): Promise<User> => {
  const userRepo = AppDataSource.getRepository(User);
  const roleRepo = AppDataSource.getRepository(Role);

  const user = await userRepo.findOne({
    where: { id: userId },
    relations: ["roles"],
  });

  if (!user) throw new Error("User not found");

  const validRoles: UserRole[] = ["user", "admin"];
  if (!newRoles.every((roleName) => validRoles.includes(roleName))) {
    throw new Error("Invalid role name provided");
  }

  const rolesToAssign = await roleRepo.findBy({ name: In(newRoles) });

  user.roles = rolesToAssign;
  console.log("Roles to assign:", rolesToAssign);

  return await userRepo.save(user);
};
