import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponseDto } from 'src/common/response';

@ObjectType()
export class CustomerDto {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

@ObjectType()
export class CustomerListDto {
  @Field(() => [CustomerDto])
  data: CustomerDto[];

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
export class CreateCustomerResponseDto extends BaseResponseDto(CustomerDto) {}

@ObjectType()
export class UpdateCustomerResponseDto extends BaseResponseDto(CustomerDto) {}

@ObjectType()
export class CustomerResponseDto extends BaseResponseDto(CustomerDto) {}

@ObjectType()
export class CustomerListResponseDto extends BaseResponseDto(CustomerListDto) {}

@ObjectType()
export class DeleteCustomerResponseDto extends BaseResponseDto(CustomerDto) {}
