import { Injectable } from '@nestjs/common';
import { IAuthRepository } from './auth.repository.interface';
import { DBConfig } from '../../config/db.config';
import { User } from '../../common/dtos/requests/auth.request.dto';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly dbConfig: DBConfig) {}

  async getUserById(id: string): Promise<User | null> {
    const user = await this.dbConfig.user.findUnique({
      where: { id },
    });
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.dbConfig.user.findUnique({
      where: { email },
    });
    return user;
  }

  async createUser(data: { email: string; password: string }): Promise<User> {
    const user = await this.dbConfig.user.create({
      data,
    });
    return user;
  }
}
