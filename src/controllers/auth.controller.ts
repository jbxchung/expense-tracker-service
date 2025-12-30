import bcrypt from 'bcrypt';
import { Request } from 'express';
import { User } from '@prisma/client';

import userService from '../services/user.service';
import { ApiResponse } from '../types/api-response';
import { HttpError } from '../errors/HttpError';
import { destroySession, saveSession } from '../utils/session.util';
import { CreateUserDto, UserDto } from '../dto/user.dto';
import { validatePassword } from '../utils/password.util';

class AuthController {
  static readonly INVALID_CREDENTIALS = 'Invalid credentials';

  async signup(req: Request): Promise<ApiResponse<UserDto | null>> {
    const { name, email, password } = req.body as CreateUserDto;

    if (!name) {
      throw new HttpError(400, 'Name is required');
    }

    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      return { success: false, message: 'User with this email already exists', data: null };
    }

    if (!validatePassword(password)) {
      throw new HttpError(400, 'Password requirements not met');
    }

    const user = await userService.create({
      name,
      email,
      password
    });

    await saveSession(req, user);

    return { success: true, message: 'Signup successful', data: user, redirectTo: '/' };
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

    await saveSession(req, user);

    return { success: true, message: 'Login successful', data: user, redirectTo: '/' };
  }

  async logout(req: Request): Promise<ApiResponse<null>> {
    await destroySession(req);

    return {
      success: true,
      message: 'Logged out',
      data: null,
      redirectTo: '/login'
    };
  }

  async getSession(req: Request): Promise<ApiResponse<UserDto | null>> {
    return { success: true, message: 'Session data retrieved', data: req.user };
  }
}

export default new AuthController();
