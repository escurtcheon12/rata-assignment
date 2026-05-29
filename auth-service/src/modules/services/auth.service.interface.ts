import {
  User,
  CreateUserDto,
} from '../../common/dtos/requests/auth.request.dto';
import {
  AuthDataDto,
  RegisterDataDto,
} from '../dtos/responses/auth.response.dto';

export interface IAuthService {
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(data: CreateUserDto): Promise<User>;

  register(email: string, password: string): Promise<RegisterDataDto>;
  login(email: string, password: string): Promise<AuthDataDto>;
  validateToken(token: string): Promise<User>;
}

export const IAuthService = Symbol('IAuthService');
