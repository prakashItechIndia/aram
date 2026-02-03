import { Module } from '@nestjs/common';
import { CommunicationTemplatesService } from './communication-templates.service';
import { CommunicationTemplatesController } from './communication-templates.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CommunicationTemplatesController],
  providers: [CommunicationTemplatesService],
  exports: [CommunicationTemplatesService],
})
export class CommunicationTemplatesModule {}
