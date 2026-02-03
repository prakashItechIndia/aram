/// <reference types="multer" />
import {
  BadRequestException,
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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { AdminUsersService } from './admin-users.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { QueryAdminUsersDto } from './dto/query-admin-users.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { S3Service } from '../s3/s3.service';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const S3_KEY_PREFIX = 'admin-users/profile';

@ApiTags('admin-users')
@Controller('admin-users')
export class AdminUsersController {
  constructor(
    private readonly service: AdminUsersService,
    private readonly s3: S3Service,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(@Query() query: QueryAdminUsersDto) {
    return this.service.findAll(query);
  }

  @Post('upload-profile-image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_SIZE },
      fileFilter: (_req, file, cb) => {
        if (!file || !ALLOWED_MIMES.includes(file.mimetype)) {
          return cb(new BadRequestException('Only JPG, PNG, WebP allowed'), false);
        }
        cb(null, true);
      },
      storage: memoryStorage(),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
    if (!file?.buffer) throw new BadRequestException('No file uploaded');
    const ext = extname(file.originalname) || '.jpg';
    const key = `${S3_KEY_PREFIX}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
    const url = await this.s3.upload(key, file.buffer, file.mimetype);
    return { url };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() dto: CreateAdminUserDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAdminUserDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
