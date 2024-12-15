import { DataSource } from "typeorm";
import { User } from "../models/User";
import { Role } from "../models/Role";
import { env } from "./env";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.DB_URL,
  entities: [User, Role],
  synchronize: true,
});
