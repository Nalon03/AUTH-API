import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { UserRole } from "../types/user";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true })
  name!: UserRole;
}
