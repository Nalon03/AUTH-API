import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { User } from "../models/User";
import { changeUserRole } from "../services/userService";
import { ApiResponse } from "../types/common";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.find({ relations: ["roles"] });
    res.status(200).json({ success: true, data: users } as ApiResponse<User[]>);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
    res.status(500).json(errorResponse);
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId, newRoles } = req.body;

    if (!userId || !newRoles || !Array.isArray(newRoles)) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
      } as ApiResponse<null>);
    }

    if (!req.user || !req.user.role.includes("admin")) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Only admins can modify roles",
      } as ApiResponse<null>);
    }

    const updatedUser = await changeUserRole(userId, newRoles);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found or update failed",
      });
    }

    res
      .status(200)
      .json({ success: true, data: updatedUser } as ApiResponse<User>);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
    res.status(500).json(errorResponse);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { id: id },
      relations: ["roles"],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      } as ApiResponse<null>);
    }

    res.status(200).json({
      success: true,
      data: user,
    } as ApiResponse<User>);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
    res.status(500).json(errorResponse);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!req.user || !req.user.role.includes("admin")) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Only admins can delete users",
      } as ApiResponse<null>);
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      } as ApiResponse<null>);
    }

    await userRepo.remove(user);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
    res.status(500).json(errorResponse);
  }
};
