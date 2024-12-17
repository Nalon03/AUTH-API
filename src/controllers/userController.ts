import { Request, Response } from "express";
import { ApiResponse, CustomError } from "../types/common";
import { AppDataSource } from "../config/db";
import { User } from "../models/User";

const handleError = (res: Response, error: any) => {
  const err = error as CustomError;
  res
    .status(err.statusCode || 400)
    .json({ success: false, message: err.message || "An error occurred" });
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      } as ApiResponse<null>);
    }

    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { id: userId },
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

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      } as ApiResponse<null>);
    }

    const { firstName, lastName, email } = req.body;

    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      } as ApiResponse<null>);
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;

    const updatedUser = await userRepo.save(user);

    res.status(200).json({
      success: true,
      data: updatedUser,
    } as ApiResponse<User>);
  } catch (error) {
    handleError(res, error);
  }
};
