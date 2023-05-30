import { Module } from '@nestjs/common';
import { VersionsService } from './versions.service';
import { VersionsController } from './versions.controller';

@Module({
  controllers: [VersionsController],
  providers: [VersionsService]
})
export class VersionsModule {}
