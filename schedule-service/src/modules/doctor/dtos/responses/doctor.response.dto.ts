import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponseDto } from 'src/common/response';

@ObjectType()
export class DoctorDto {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

@ObjectType()
export class DoctorListDto {
  @Field(() => [DoctorDto])
  data: DoctorDto[];

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
export class CreateDoctorResponseDto extends BaseResponseDto(DoctorDto) {}

@ObjectType()
export class UpdateDoctorResponseDto extends BaseResponseDto(DoctorDto) {}

@ObjectType()
export class DoctorResponseDto extends BaseResponseDto(DoctorDto) {}

@ObjectType()
export class DoctorListResponseDto extends BaseResponseDto(DoctorListDto) {}
