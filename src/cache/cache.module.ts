import { CacheController } from './cache.controller';
import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
  controllers: [CacheController],
})
export class RedisCacheModule {}
