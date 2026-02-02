import { Module } from '@nestjs/common';
import { EChallansService } from './e-challans.service';
import { EChallansController } from './e-challans.controller';
import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [EChallansController],
  providers: [EChallansService],
  exports: [EChallansService],
})
export class EChallansModule {}
