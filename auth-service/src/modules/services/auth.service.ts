import { Inject, Injectable } from '@nestjs/common';
import { IAuthRepository } from '../repositories/auth.repository.interface';
import {
  User,
  CreateUserDto,
} from '../../common/dtos/requests/auth.request.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
  ) {}

  async getUserById(id: string): Promise<User | null> {
    return this.authRepository.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.authRepository.getUserByEmail(email);
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return this.authRepository.createUser(data);
  }
}
