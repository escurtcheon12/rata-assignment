import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateDoctorDto {
  @Field()
  @IsString()
  @MinLength(1)
  name: string;
}

@InputType()
export class UpdateDoctorDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;
}

@InputType()
export class DoctorPaginationDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  page?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  pageSize?: string;
}