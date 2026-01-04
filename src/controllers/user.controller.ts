import { Request } from 'express';
import { User } from '@prisma/client';
import userService from 'services/user.service';
import { ApiResponse } from 'types/api-response';
import { HttpError } from 'errors/HttpError';

class UserController {
  async getAll(): Promise<ApiResponse<User[]>> {
    const users = await userService.getAll();
    return { success: true, message: 'retrieved all users', data: users };
  }

  async getById(req: Request): Promise<ApiResponse<User>> {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      throw new HttpError(400, 'ID is required');
    }

    const user = await userService.findById(id);
    if (!user) {
      throw new HttpError(404, 'User not found');
    }
    
    return { success: true, message: 'User retrieved by id', data: user };
  }

  // todo - this is an exact match search right now, should implement partial match
  async getByName(req: Request): Promise<ApiResponse<User[]>> {
    const { name } = req.query;
    if (!name || typeof name !== 'string') {
      throw new HttpError(400, 'Name is required');
    }

    const users = await userService.findByName(name) ?? [];
    return { success: true, message: `Users found by name`, data: users };
  }

  async getByEmail(req: Request): Promise<ApiResponse<User>> {
    const { email } = req.params;
    if (!email || typeof email !== 'string') {
      throw new HttpError(400, 'Email is required');
    }

    const user = await userService.findByEmail(email);
    if (!user) {
      throw new HttpError(404, 'User not found');
    }
    return { success: true, message: 'User retrieved by email', data: user };
  }
}

export default new UserController();
