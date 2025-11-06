import { User } from '@prisma/client';
import { Service } from './service.interface';
import userRepository from '../repositories/user.repository';

class UserService implements Service {

    async initialize(): Promise<void> {
    }

    async getAll(): Promise<User[]> {
        return userRepository.findAll();
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
