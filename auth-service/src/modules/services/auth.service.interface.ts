import {
  User,
  CreateUserDto,
} from '../../common/dtos/requests/auth.request.dto';

export interface IAuthService {
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(data: CreateUserDto): Promise<User>;
}

export const IAuthService = Symbol('IAuthService');
