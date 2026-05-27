import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterRequestDto {
  @Field()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @Field()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

@InputType()
export class LoginRequestDto {
  @Field()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @Field()
  @IsString({ message: 'Password must be a string' })
  password: string;
}
