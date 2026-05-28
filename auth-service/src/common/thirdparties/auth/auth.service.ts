import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import type { Cache } from 'cache-manager';
// import * as CacheStoreNamespace from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { AuthUserResponse } from '../../dtos/responses/auth.response.dto';
import type { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject(ConfigService)
    private readonly cfg: ConfigService,
  ) {}

  async checkAuthUser(token: string): Promise<AuthUserResponse> {
    const secretkey = this.cfg.get<string>('jwt.secret');
    const checkToken: any = await jwt.verify(
      token,
      secretkey,
      function (err, decode) {
        if (err) {
          throw new UnauthorizedException('Unauthorized - ' + err.message);
        }

        return decode;
      },
    );
    const { userId } = checkToken;
    if (!userId)
      throw new UnauthorizedException('Unauthorized - Invalid Token Signature');

    const keyRedis = `auth-${userId}`;
    // const dataAuthUser = await this.redis.get(keyRedis);
    const dataAuthRedis: any = await this.cacheManager.get(keyRedis);
    const dataAuthUser =
      typeof dataAuthRedis == 'string'
        ? JSON.parse(dataAuthRedis)
        : dataAuthRedis;

    if (!dataAuthUser || Object.keys(dataAuthUser).length === 0)
      throw new UnauthorizedException('Unauthorized - Token is expired');

    //Multiple Session Login Validation
    if (dataAuthUser.token_active != token) {
      throw new UnauthorizedException(
        'Unauthorized - Session expired, your session active at another device',
      );
    }

    // Re-Set Redis for update redis expired
    // await this.redis.set(dataAuthUser, keyRedis, 1, 'hour');
    await this.cacheManager.set(
      keyRedis,
      JSON.stringify(dataAuthUser),
      1000 * 60 * 60, //--> Set Time To Live 60 Minutes.
    );

    const dataUser = {
      id: dataAuthUser.id,
      email: dataAuthUser.email,
      password: dataAuthUser.password,
      token_active: dataAuthUser.token_active,
    };

    return dataUser;
  }
}
