import { Request, Response, NextFunction } from 'express';
import userService from 'services/user.service';

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated',
    });
  }

  const user = await userService.findById(userId);
  if (!user) {
    req.session.destroy(() => {});
    return res.status(401).json({
      success: false,
      message: 'Session invalid',
    });
  }

  req.user = user;
  next();
}
