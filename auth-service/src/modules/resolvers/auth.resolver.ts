import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'crypto-js';

import { IAuthService } from '../services/auth.service.interface';
import type { Cache } from 'cache-manager';
import { AuthResponseDto, User } from '../dtos/responses/auth.response.dto';
import {
  LoginRequestDto,
  RegisterRequestDto,
} from '../dtos/requests/auth.request.dto';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject(IAuthService)
    private readonly authService: IAuthService,
    private readonly configService: ConfigService,
  ) {}

  @Mutation(() => AuthResponseDto)
  async register(
    @Args('input') input: RegisterRequestDto,
  ): Promise<AuthResponseDto> {
    const existingUser = await this.authService.getUserByEmail(input.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    const hashedPassword = bcrypt.SHA256(input.password).toString();
    const user = await this.authService.createUser({
      email: input.email,
      password: hashedPassword,
    });

    const secretkey = this.configService.get<string>('jwt.secret');
    const expiresIn = this.configService.get<string>('jwt.expiresIn');
    const token = jwt.sign({ userId: user.id }, secretkey, {
      expiresIn,
    });

    const keyRedis = `auth-${user.id}`;
    await this.cacheManager.set(
      keyRedis,
      JSON.stringify({ userId: user.id, token_active: token }),
      86400,
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

  @Mutation(() => AuthResponseDto)
  async login(@Args('input') input: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.authService.getUserByEmail(input.email);
    if (!user) {
      throw new UnauthorizedException('Email not registered');
    }

    const hashedPassword = bcrypt.SHA256(input.password).toString();
    if (user.password !== hashedPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const secretkey = this.configService.get<string>('jwt.secret');
    const expiresIn = this.configService.get<string>('jwt.expiresIn');
    const token = jwt.sign({ userId: user.id }, secretkey, {
      expiresIn,
    });

    const keyRedis = `auth-${user.id}`;
    await this.cacheManager.set(
      keyRedis,
      JSON.stringify({ userId: user.id, token_active: token }),
      86400,
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

  @Query(() => User)
  async validateToken(@Args('token') token: string): Promise<User> {
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

    const user = await this.authService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
