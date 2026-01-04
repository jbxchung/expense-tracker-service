import bcrypt from 'bcrypt';
import { User, UserRole } from '@prisma/client';

import config from 'config/config';

import { CreateUserDto } from 'dto/user.dto';
import userRepository from 'repositories/user.repository';
import { DB_GENERATED_FIELDS } from 'repositories/base.repository';

import categoryService from './category.service';

class UserService {
  async getAll(): Promise<User[]> {
    return userRepository.findAll();
  }

  // create new user and assign default categories
  async create(newUserDto: CreateUserDto) {
    const isFirstUser = await userRepository.getCount() === 0;
    let userRole = newUserDto.role;
    if (isFirstUser) {
      // first user must be OWNER
      userRole = UserRole.OWNER;
    } else if (!newUserDto.role) {
      // default to USER if not specified
      userRole = UserRole.USER;
    }

    const passwordHash = await bcrypt.hash(newUserDto.password, config.bcryptSaltRounds);
    const newUser: Omit<User, DB_GENERATED_FIELDS> = {
      name: newUserDto.name,
      email: newUserDto.email,
      passwordHash,
      role: userRole!,
    }
    const createdUser = await userRepository.create(newUser);

    // todo - extract category initialization
    const globalCategories = await categoryService.findGlobal();
    for (const category of globalCategories) {
      const { id, createdAt, updatedAt, ...rest } = category;
      await categoryService.create({
        ...rest,
        userId: createdUser.id,
      })
    }

    return createdUser;
  }

  async findById(userId: string): Promise<User | null> {
    return userRepository.findById(userId);
  }

  async findByName(name: string): Promise<User[] | null> {
    return userRepository.findByName(name);
  }

  async findByEmail(email: string): Promise<User | null> {
    return userRepository.findByEmail(email);
  }

  // for initial setup - need to know if there are any users yet
  async hasAnyUsers(): Promise<boolean> {
    const count = await userRepository.getCount()
    return count > 0;
  }
}

export default new UserService();
