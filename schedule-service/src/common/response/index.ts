import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export function BaseResponseDto<T>(DataType: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class BaseResponseDtoClass {
    @Field()
    message: string;

    @Field(() => DataType)
    result: T;
  }
  return BaseResponseDtoClass;
}
