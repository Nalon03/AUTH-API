import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Role } from "./Role";

@Entity()
export class User {
  static findById(userId: any) {
    throw new Error("Method not implemented.");
  }
  static findByIdAndUpdate(
    userId: any,
    arg1: { firstName: any; lastName: any; email: any },
    arg2: { new: boolean; runValidators: boolean }
  ) {
    throw new Error("Method not implemented.");
  }
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles!: Role[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
