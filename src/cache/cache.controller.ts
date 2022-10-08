import { Controller, Delete, Param, Post } from '@nestjs/common';
import { CacheService } from './cache.service';
import { Response } from 'src/utils/interface/response.interface';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { ADMIN_PERMISSION } from 'src/auth/permission/permission';

@Controller('cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Auth(ADMIN_PERMISSION)
  @Post('/reset')
  async resetCache() {
    await this.cacheService.reset();
    return Response.success();
  }

  @Auth(ADMIN_PERMISSION)
  @Delete('/clear/:key')
  async clearCache(@Param('key') key: string) {
    await this.cacheService.clearCacheByPattern(key);
    return Response.success();
  }
}
