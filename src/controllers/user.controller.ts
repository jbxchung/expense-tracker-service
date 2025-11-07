import { NextFunction, Request, Response } from 'express';
import userService from '../services/user.service';

class UserController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAll();
      res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {      
      const { id } = req.params;
      if (!id || typeof id !== 'string') return res.status(400).json({ error: 'ID is required' });

      const user = await userService.findById(id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (e) {
      next(e);
    }
  }

  // todo - this is an exact match search, implement partial match
  async getByName(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.query;
      if (!name || typeof name !== 'string') return res.status(400).json({ error: 'Name is required' });

      const users = await userService.findByName(name);
      res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async getByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;
      if (!email || typeof email !== 'string') return res.status(400).json({ error: 'Email is required' });

      const user = await userService.findByEmail(email);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
