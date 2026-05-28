import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponseDto } from 'src/common/response';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class AuthDataDto {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class RegisterDataDto {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class AuthResponseDto extends BaseResponseDto(AuthDataDto) {}

@ObjectType()
export class RegisterResponseDto extends BaseResponseDto(RegisterDataDto) {}

@ObjectType()
export class ValidateTokenResponseDto extends BaseResponseDto(User) {}
