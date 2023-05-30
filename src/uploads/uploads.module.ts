import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uploads } from './entities/upload.entity';
import { AWSModule } from 'src/aws/aws.module';

@Module({
  imports: [TypeOrmModule.forFeature([Uploads]), AWSModule],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
