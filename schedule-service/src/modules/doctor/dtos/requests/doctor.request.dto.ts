import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateCustomerDto {
  @Field()
  @IsString()
  @MinLength(1)
  name: string;

  @Field()
  @IsEmail()
  email: string;
}

@InputType()
export class UpdateCustomerDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;
}

@InputType()
export class CustomerPaginationDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  page?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  pageSize?: string;
}
