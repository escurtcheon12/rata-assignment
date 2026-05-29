import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IAuthRepository } from '../repositories/auth.repository.interface';
import {
  User,
  CreateUserDto,
} from '../../common/dtos/requests/auth.request.dto';
import { IAuthService } from './auth.service.interface';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'crypto-js';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  AuthDataDto,
  RegisterDataDto,
} from '../dtos/responses/auth.response.dto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
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

  async register(email: string, password: string): Promise<RegisterDataDto> {
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    const hashedPassword = bcrypt.SHA256(password).toString();

    const user = await this.createUser({
      email,
      password: hashedPassword,
    });
    if (!user) {
      throw new BadRequestException(`Failed create user`);
    }

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async login(email: string, password: string): Promise<AuthDataDto> {
    const user = await this.getUserByEmail(email);

    const hashedPassword = bcrypt.SHA256(password).toString();
    if (!user || user.password !== hashedPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const secretkey = this.configService.get<string>('jwt.secret');
    if (!secretkey) {
      throw new Error('JWT_SECRET is not configured');
    }
    const expiresIn = this.configService.get<string>('jwt.expiresIn') || '1d';
    const token = jwt.sign({ userId: user.id }, secretkey, { expiresIn });
    token;
    const keyRedis = `auth-${user.id}`;
    await this.cacheManager.set(
      keyRedis,
      JSON.stringify({
        id: user.id,
        email: user.email,
        password: user.password,
        token_active: token,
      }),
      1000 * 60 * 60 /* 1hr  */,
    );

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  async validateToken(token: string): Promise<User> {
    const secretkey = this.configService.get<string>('jwt.secret');
    if (!secretkey) {
      throw new UnauthorizedException('JWT secret not configured');
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, secretkey);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    const userId = String((decoded as { userId?: string }).userId || '');
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    const keyRedis = `auth-${userId}`;
    const dataAuthRedisStr: string | undefined =
      await this.cacheManager.get(keyRedis);
    const dataAuthUser = dataAuthRedisStr ? JSON.parse(dataAuthRedisStr) : null;

    if (!dataAuthUser || dataAuthUser.token_active !== token) {
      throw new UnauthorizedException('Token expired or session invalid');
    }

    const user = await this.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
