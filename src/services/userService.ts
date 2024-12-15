import { AppDataSource } from "../config/db";
import { User } from "../models/User";
import { Role } from "../models/Role";

export const changeUserRole = async (
  userId: string,
  newRoles: Role[]
): Promise<User> => {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({
    where: { id: userId },
    relations: ["roles"],
  });

  if (!user) throw new Error("User not found");

  user.roles = newRoles;
  return await userRepo.save(user);
};
