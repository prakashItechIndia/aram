import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { S3Service } from '../s3/s3.service';
import { SponsorsService } from './sponsors.service';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const S3_KEY_PREFIX = 'sponsors';

@ApiTags('sponsors')
@Controller('website/sponsors')
export class SponsorsController {
  constructor(
    private readonly service: SponsorsService,
    private readonly s3: S3Service,
  ) { }

  @Get()
  @ApiQuery({ name: 'tier', required: false, type: String })
  @ApiQuery({ name: 'contributionType', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'featuredOnly', required: false, type: Boolean })
  findAll(
    @Query('tier') tier?: string,
    @Query('contributionType') contributionType?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('featuredOnly') featuredOnly?: string,
  ) {
    return this.service.findAll({
      tier,
      contributionType,
      status,
      search,
      featuredOnly: featuredOnly === 'true',
    });
  }

  @Patch('reorder')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              displayOrder: { type: 'number' },
            },
          },
        },
      },
    },
  })
  async reorder(@Body('items') items: { id: number; displayOrder: number }[]) {
    if (!Array.isArray(items)) throw new BadRequestException('Items must be an array');
    return this.service.reorder(items);
  }

  @Post('upload-logo')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_SIZE },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIMES.includes(file.mimetype)) {
          return cb(new BadRequestException('Only JPG, PNG, SVG, WebP allowed'), false);
        }
        cb(null, true);
      },
      storage: memoryStorage(),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  async uploadLogo(@UploadedFile() file: Express.Multer.File) {
    if (!file?.buffer) throw new BadRequestException('No file uploaded');
    const ext = extname(file.originalname) || '.png';
    const key = `${S3_KEY_PREFIX}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
    const url = await this.s3.upload(key, file.buffer, file.mimetype);
    return { logoUrl: url };
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() dto: CreateSponsorDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSponsorDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
