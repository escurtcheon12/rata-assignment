import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { IAuthService } from '../services/auth.service.interface';
import {
  AuthResponseDto,
  RegisterResponseDto,
  ValidateTokenResponseDto,
} from '../dtos/responses/auth.response.dto';
import {
  LoginRequestDto,
  RegisterRequestDto,
} from '../dtos/requests/auth.request.dto';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(IAuthService)
    private readonly authService: IAuthService,
  ) {}

  @Mutation(() => RegisterResponseDto)
  async register(@Args('input') input: RegisterRequestDto) {
    return this.authService.register(input.email, input.password);
  }

  @Mutation(() => AuthResponseDto)
  async login(@Args('input') input: LoginRequestDto) {
    return this.authService.login(input.email, input.password);
  }

  @Query(() => ValidateTokenResponseDto)
  async validateToken(@Args('token') token: string) {
    return this.authService.validateToken(token);
  }
}
