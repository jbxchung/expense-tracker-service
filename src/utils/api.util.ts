import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/api-response';

type AsyncController<T> = (req: Request) => Promise<ApiResponse<T>>;

export const handle = <T>(fn: AsyncController<T>) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await fn(req);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    next(err);
  }
};