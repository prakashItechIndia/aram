import { Module } from '@nestjs/common';
import { CommunicationTemplatesService } from './communication-templates.service';
import { CommunicationTemplatesController } from './communication-templates.controller';

@Module({
  controllers: [CommunicationTemplatesController],
  providers: [CommunicationTemplatesService],
  exports: [CommunicationTemplatesService],
})
export class CommunicationTemplatesModule {}
