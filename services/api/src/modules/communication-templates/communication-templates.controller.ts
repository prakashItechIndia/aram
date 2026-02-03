import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CommunicationTemplatesService } from './communication-templates.service';
import { CreateCommunicationTemplateDto } from './dto/create-communication-template.dto';
import { UpdateCommunicationTemplateDto } from './dto/update-communication-template.dto';
import { QueryCommunicationTemplatesDto } from './dto/query-communication-templates.dto';
import { PreviewCommunicationTemplateDto } from './dto/preview-communication-template.dto';
import { TestSendCommunicationTemplateDto } from './dto/test-send-communication-template.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('communication-templates')
@Controller('communication-templates')
export class CommunicationTemplatesController {
  constructor(private readonly service: CommunicationTemplatesService) {}

  @Get()
  async findAll(@Query() query: QueryCommunicationTemplatesDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const row = await this.service.findById(id);
    if (!row) throw new NotFoundException(`Template #${id} not found`);
    return row;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() dto: CreateCommunicationTemplateDto,
    @Request() req?: { user?: { email?: string; name?: string } },
  ) {
    const updatedBy = req?.user?.name ?? req?.user?.email ?? undefined;
    return this.service.create(dto, updatedBy);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommunicationTemplateDto,
    @Request() req?: { user?: { email?: string; name?: string } },
  ) {
    const updatedBy = req?.user?.name ?? req?.user?.email ?? undefined;
    return this.service.update(id, dto, updatedBy);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  @Post(':id/duplicate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async duplicate(
    @Param('id', ParseIntPipe) id: number,
    @Request() req?: { user?: { email?: string; name?: string } },
  ) {
    const updatedBy = req?.user?.name ?? req?.user?.email ?? undefined;
    return this.service.duplicate(id, updatedBy);
  }

  @Post(':id/preview')
  async preview(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PreviewCommunicationTemplateDto,
  ) {
    return this.service.getPreview(id, body.sampleVariables);
  }

  @Post(':id/test-send')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async testSend(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TestSendCommunicationTemplateDto,
  ) {
    return this.service.testSend(id, {
      email: dto.email,
      mobile: dto.mobile,
      sampleVariables: dto.sampleVariables,
    });
  }
}
