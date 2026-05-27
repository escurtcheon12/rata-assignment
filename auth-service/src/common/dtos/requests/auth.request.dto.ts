export class User {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly createdAt: Date;
  readonly updatedAt: Date | null;
}

export class CreateUserDto {
  email: string;
  password: string;
}

export class AuthRequestDto {
  readonly id: string;
  readonly email: string;
  readonly password: string;
}
