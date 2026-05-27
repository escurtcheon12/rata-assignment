import { CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheConfig implements CacheOptionsFactory {
  constructor(private configService: ConfigService) {}

  createCacheOptions() {
    return this.configService.get('cache');
  }
}
