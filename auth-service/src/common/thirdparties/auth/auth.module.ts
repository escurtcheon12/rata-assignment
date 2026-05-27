import { Module } from '@nestjs/common';
import { AuthService } from './auth.servce';

@Module({
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
