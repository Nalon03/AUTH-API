export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface CustomError extends Error {
  statusCode?: number;
}

export interface SuccessResponse<T> {
  success: boolean;
  data: T;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
}
