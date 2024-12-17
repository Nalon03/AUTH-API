import { AppDataSource } from "../config/db";
import { User } from "../models/User";
import { UserRole } from "@/types/user";
import { Role } from "../models/Role"; 

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

  const rolesToAssign: Role[] = await Promise.all(newRoles.map(async (roleName) => {
    const role = await roleRepo.findOne({ where: { name: roleName } });
    if (!role) {
      throw new Error(`Role not found for name: ${roleName}`);
    }
    return role;
  }));

  user.roles = rolesToAssign; 
  
  return await userRepo.save(user); 
};
