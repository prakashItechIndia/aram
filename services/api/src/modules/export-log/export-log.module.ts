import { Module } from '@nestjs/common';
import { ExportLogService } from './export-log.service';
import { ExportLogController } from './export-log.controller';

@Module({
  controllers: [ExportLogController],
  providers: [ExportLogService],
  exports: [ExportLogService],
})
export class ExportLogModule {}
