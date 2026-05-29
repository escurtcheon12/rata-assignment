import { CacheOptionsFactory, CacheModuleOptions } from '@nestjs/cache-manager';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';

@Injectable()
export class CacheConfig implements CacheOptionsFactory {
  private readonly logger = new Logger(CacheConfig.name);

  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions {
    const host = this.configService.get<string>('cache.host');
    const port = this.configService.get<number>('cache.port');
    const password = this.configService.get<string>('cache.password');

    const authString = password ? `:${password}@` : '';
    const redisUrl = `redis://${authString}${host}:${port}`;

    this.logger.log(`📡 Connecting to Redis via Keyv at: ${host}:${port}`);

    return {
      stores: [new KeyvRedis(redisUrl)],
      ttl: 3600000,
    } as any;
  }
}
