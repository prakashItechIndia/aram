import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { S3Service } from '../s3/s3.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { GalleryAlbumsService } from './gallery-albums.service';
import { CreateGalleryAlbumDto } from './dto/create-gallery-album.dto';
import { UpdateGalleryAlbumDto } from './dto/update-gallery-album.dto';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const S3_KEY_PREFIX = 'gallery-albums';

@ApiTags('gallery-albums')
@Controller('website/gallery/albums')
export class GalleryAlbumsController {
  constructor(
    private readonly service: GalleryAlbumsService,
    private readonly s3: S3Service,
  ) { }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() dto: CreateGalleryAlbumDto) {
    return this.service.create(dto);
  }

  @Post(':id/cover')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_SIZE },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIMES.includes(file.mimetype)) {
          return cb(new BadRequestException('Only JPG, PNG, WebP allowed'), false);
        }
        cb(null, true);
      },
      storage: memoryStorage(),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  async uploadCover(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file?.buffer) throw new BadRequestException('No file uploaded');
    const ext = extname(file.originalname) || '.jpg';
    const key = `${S3_KEY_PREFIX}/${id}-${Date.now()}${ext}`;
    const url = await this.s3.upload(key, file.buffer, file.mimetype);
    return this.service.update(id, { coverImageUrl: url });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGalleryAlbumDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
