import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { IAuthService } from './services/auth.service.interface';
import { IAuthRepository } from './repositories/auth.repository.interface';
import { AuthRepository } from './repositories/auth.repository';
import { DBConfig } from '../config/db.config';
import { AuthResolver } from './resolvers/auth.resolver';

@Module({
  controllers: [],
  providers: [
    {
      provide: IAuthService,
      useClass: AuthService,
    },
    {
      provide: IAuthRepository,
      useClass: AuthRepository,
    },
    DBConfig,
    AuthResolver,
  ],
})
export class AuthModule {}
