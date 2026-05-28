import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';

@InputType()
export class CreateScheduleDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  objective: string;

  @Field()
  @IsUUID()
  customerId: string;

  @Field()
  @IsUUID()
  doctorId: string;

  @Field()
  @IsDateString()
  scheduledAt: string;
}

@InputType()
export class ScheduleFilterDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  scheduledFrom?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  scheduledTo?: string;
}

@InputType()
export class SchedulePaginationDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  page?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  pageSize?: string;

  @Field(() => ScheduleFilterDto, { nullable: true })
  @IsOptional()
  filter?: ScheduleFilterDto;
}
