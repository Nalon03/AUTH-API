import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";
import { RegisterInput, LoginInput, AuthTokens } from "../types/auth";
import { CustomError, SuccessResponse, ErrorResponse } from "../types/common";

const sendResponse = (
  res: Response,
  statusCode: number,
  data: any,
  success: boolean
) => {
  res.status(statusCode).json({ success, data });
};

const handleError = (res: Response, error: any) => {
  const err = error as CustomError;
  res
    .status(err.statusCode || 400)
    .json({ success: false, message: err.message || "An error occurred" });
};

export const register = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response<SuccessResponse<any> | ErrorResponse>
) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log(req.body);
    const user = await registerUser(firstName, lastName, email, password);
    sendResponse(res, 201, user, true);
  } catch (error) {
    handleError(res, error);
  }
};

export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response<SuccessResponse<AuthTokens> | ErrorResponse>
) => {
  try {
    const { email, password } = req.body;
    const tokens = await loginUser(email, password);
    sendResponse(res, 200, tokens, true);
  } catch (error) {
    handleError(res, error);
  }
};
export { loginUser };
