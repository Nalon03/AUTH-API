import { AppDataSource } from "../config/db";
import { Role } from "../models/Role";
import { UserRole } from "../types/user";

export const initializeRoles = async () => {
  const roleRepo = AppDataSource.getRepository(Role);
  const defaultRoles: UserRole[] = ["user", "admin"];

  for (const roleName of defaultRoles) {
    let role = await roleRepo.findOne({ where: { name: roleName } });

    if (!role) {
      role = roleRepo.create({ name: roleName });
      await roleRepo.save(role);
    } 
  }
};
