import { UserRole } from '@prisma/client';

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
