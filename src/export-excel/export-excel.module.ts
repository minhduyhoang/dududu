import { Module } from '@nestjs/common';
import { ExportExcelController } from './export-excel.controller';
import { ExportExcelService } from './export-excel.service';

@Module({
  controllers: [ExportExcelController],
  providers: [ExportExcelService],
  exports: [ExportExcelService],
})
export class ExportExcelModule {}
