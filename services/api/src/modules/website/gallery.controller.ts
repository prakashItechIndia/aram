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
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { S3Service } from '../s3/s3.service';
import { GalleryService } from './gallery.service';
import { CreateGalleryItemDto } from './dto/create-gallery-item.dto';
import { UpdateGalleryItemDto } from './dto/update-gallery-item.dto';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const S3_KEY_PREFIX = 'gallery';

@ApiTags('gallery')
@Controller('website/gallery')
export class GalleryController {
  constructor(
    private readonly service: GalleryService,
    private readonly s3: S3Service,
  ) {}

  @Get()
  @ApiQuery({ name: 'albumId', required: false, type: String })
  @ApiQuery({ name: 'tag', required: false, type: String })
  @ApiQuery({ name: 'visibility', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(
    @Query('albumId') albumId?: string,
    @Query('tag') tag?: string,
    @Query('visibility') visibility?: string,
    @Query('search') search?: string,
  ) {
    return this.service.findAll({
      albumId,
      tag,
      visibility,
      search,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post('upload')
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
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file?.buffer) throw new BadRequestException('No file uploaded');
    const ext = extname(file.originalname) || '.jpg';
    const key = `${S3_KEY_PREFIX}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
    const url = await this.s3.upload(key, file.buffer, file.mimetype);
    return { imagePath: url, thumbnailPath: url };
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() dto: CreateGalleryItemDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGalleryItemDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Get(':id/download')
  async downloadImage(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const item = await this.service.findById(id);
    if (!item) throw new BadRequestException('Gallery item not found');
    
    // Extract the S3 key from the full URL
    const url = new URL(item.imagePath);
    const key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
    
    // Generate filename from title or path
    const ext = extname(item.imagePath).slice(1) || 'jpg';
    const filename = item.title ? `${item.title}.${ext}` : `image.${ext}`;
    
    // Generate signed URL with Content-Disposition header
    const signedUrl = await this.s3.getSignedDownloadUrl(key, filename);
    
    // Redirect to signed URL
    res.redirect(signedUrl);
  }
}
