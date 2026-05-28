import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfig } from './config/cache.config';
import { RedisClientOptions } from 'redis';
import { AuthModule } from './modules/auth.module';
import { AuthModule as ThirdPartyAuthModule } from './common/thirdparties/auth/auth.module';
import { DBConfig } from './config/db.config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ResponseWrapperInterceptor } from './common/interceptors';

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
    AuthModule,
    ThirdPartyAuthModule,
  ],
  controllers: [],
  providers: [DBConfig, ResponseWrapperInterceptor],
  exports: [DBConfig],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AuthMiddleware)
  //     .exclude(
  //       // {
  //       //   path: 'user/login',
  //       //   method: RequestMethod.POST,
  //       // },
  //       // {
  //       //   path: 'user/login-check',
  //       //   method: RequestMethod.POST,
  //       // },
  //       {
  //         path: 'graphql',
  //         method: RequestMethod.ALL,
  //       },
  //     )
  //     .forRoutes(
  //       { path: '*', method: RequestMethod.GET },
  //       { path: '*', method: RequestMethod.PUT },
  //       { path: '*', method: RequestMethod.POST },
  //       { path: '*', method: RequestMethod.PATCH },
  //       { path: '*', method: RequestMethod.DELETE },
  //     );
  // }
}
