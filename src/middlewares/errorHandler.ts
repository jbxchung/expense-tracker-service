import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/HttpError';
import { ApiResponse } from '../types/api-response';

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  let status = 500;
  let response: ApiResponse<undefined> = { success: false, message: 'Internal server error' };
  if (err instanceof HttpError) {
    status = err.status;
    response.message = err.message;
  }

  res.status(status).json(response);
};