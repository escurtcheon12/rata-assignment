import { Field, ObjectType } from '@nestjs/graphql';

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
export class AuthResponseDto {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
