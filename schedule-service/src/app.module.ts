import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfig } from './config/cache.config';
import { RedisClientOptions } from 'redis';
import { AuthModule as ThirdPartyAuthModule } from './common/thirdparties/auth/auth.module';
import { DBConfig } from './config/db.config';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ResponseWrapperInterceptor } from './common/interceptors';
import { CustomerModule } from './modules/customer/customer.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { EmailModule } from './common/thirdparties/email';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [config],
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      useClass: CacheConfig,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(
        process.cwd(),
        'src/common/thirdparties/graphql/schema.gql',
      ),
      sortSchema: true,
      playground: true,
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    CustomerModule,
    DoctorModule,
    ScheduleModule,
    ThirdPartyAuthModule,
    EmailModule,
  ],
  controllers: [],
  providers: [DBConfig, ResponseWrapperInterceptor],
  exports: [DBConfig],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '*', method: RequestMethod.GET },
        { path: '*', method: RequestMethod.PUT },
        { path: '*', method: RequestMethod.POST },
        { path: '*', method: RequestMethod.PATCH },
        { path: '*', method: RequestMethod.DELETE },
      );
  }
}
