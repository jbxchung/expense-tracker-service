import bcrypt from 'bcrypt';
import { Request } from 'express';
import { User } from '@prisma/client';

import userService from '../services/user.service';
import { ApiResponse } from '../types/api-response';
import { HttpError } from '../errors/HttpError';
import { destroySession } from '../utils/session.util';
import { CreateUserDto, UserDto } from '../dto/user.dto';

class AuthController {
  static readonly INVALID_CREDENTIALS = 'Invalid credentials';

  async signup(req: Request): Promise<ApiResponse<UserDto>> {
    const { name, email, password } = req.body as CreateUserDto;

    const user = await userService.create({
      name,
      email,
      password
    });

    req.session.userId = user.id;

    return { success: true, message: 'Signup successful', data: user };
  }

  async login(req: Request): Promise<ApiResponse<User>> {
    const { email, password } = req.body;

    const user = await userService.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw new HttpError(401, AuthController.INVALID_CREDENTIALS);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new HttpError(401, AuthController.INVALID_CREDENTIALS);
    }

    req.session.userId = user.id;

    return { success: true, message: 'Login successful', data: user };
  }

  async logout(req: Request): Promise<ApiResponse<null>> {
    await destroySession(req);

    return {
      success: true,
      message: 'Logged out',
      data: null,
    }
  }

  async getSession(req: Request): Promise<ApiResponse<UserDto | null>> {
    const userId = req.session.userId;

    if (!userId) {
      return { success: false, message: 'Not logged in', data: null };
    }

    // user no longer exists, clear session
    const user = await userService.findById(userId);
    if (!user) {
      req.session.destroy(err => {});
      return { success: false, message: 'Not logged in', data: null };
    }

    return { success: true, message: 'Session data retrieve', data: user };
  }
}

export default new AuthController();
