import { Module } from '@nestjs/common';
import { FeatureConfigService } from './feature-config.service';
import { ConfigController } from './config.controller';

@Module({
  controllers: [ConfigController],
  providers: [FeatureConfigService],
  exports: [FeatureConfigService],
})
export class FeatureConfigModule {}
