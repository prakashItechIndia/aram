import { Module } from '@nestjs/common';
import { EChallansService } from './e-challans.service';
import { EChallansController } from './e-challans.controller';

@Module({
  controllers: [EChallansController],
  providers: [EChallansService],
  exports: [EChallansService],
})
export class EChallansModule {}
