import { User } from '../../common/dtos/requests/auth.request.dto';

export interface IAuthRepository {
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(data: { email: string; password: string }): Promise<User>;
}

export const IAuthRepository = Symbol('IAuthRepository');
