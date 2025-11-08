import { Request, Response, NextFunction } from 'express';

export const handle = (fn: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await fn(req);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    next(err);
  }
};