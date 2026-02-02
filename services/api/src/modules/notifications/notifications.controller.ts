import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  findAll(@Query('userId') userId?: number) {
    return this.service.findAll(userId ? Number(userId) : undefined);
  }

  @Post()
  create(@Body() data: { userId?: number; type: string; title: string; message: string }) {
    return this.service.create(data);
  }

  @Patch(':id/read')
  markRead(@Param('id', ParseIntPipe) id: number) {
    return this.service.markAsRead(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Get('unread-count/:userId')
  getUnreadCount(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.findUnreadCount(userId);
  }
}
