import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponseDto } from 'src/common/response';

@ObjectType()
export class CustomerRefDto {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;
}

@ObjectType()
export class DoctorRefDto {
  @Field()
  id: string;

  @Field()
  name: string;
}

@ObjectType()
export class ScheduleDto {
  @Field()
  id: string;

  @Field()
  objective: string;

  @Field()
  customerId: string;

  @Field()
  doctorId: string;

  @Field()
  scheduledAt: Date;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

@ObjectType()
export class ScheduleListDto {
  @Field(() => [ScheduleDto])
  data: ScheduleDto[];

  @Field()
  totalRecords: number;

  @Field()
  page: number;

  @Field()
  pageSize: number;

  @Field()
  totalPages: number;
}

@ObjectType()
export class CreateScheduleResponseDto extends BaseResponseDto(ScheduleDto) {}

@ObjectType()
export class ScheduleResponseDto extends BaseResponseDto(ScheduleDto) {}

@ObjectType()
export class ScheduleListResponseDto extends BaseResponseDto(ScheduleListDto) {}
