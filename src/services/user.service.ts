import { User } from '@prisma/client';
import userRepository from '../repositories/user.repository';
import { DB_GENERATED_FIELDS } from '../repositories/base.repository';
import categoryService from './category.service';

class UserService {
  async getAll(): Promise<User[]> {
    return userRepository.findAll();
  }

  // create new user and assign default categories
  async create(newUser: Omit<User, DB_GENERATED_FIELDS>) {
    const createdUser = await userRepository.create(newUser);

    const globalCategories = await categoryService.findGlobal();
    for (const category of globalCategories) {
      await categoryService.create({
        ...category,
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
}

export default new UserService();
