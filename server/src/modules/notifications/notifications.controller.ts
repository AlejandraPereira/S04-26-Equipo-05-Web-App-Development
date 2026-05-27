import { Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/core/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get('mine')
  getMine(@Request() req: any) {
    return this.service.getMyNotifications(req.user.id);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req: any) {
    return this.service.getUnreadCount(req.user.id).then(count => ({ count }));
  }

  @Patch('read-all')
  markAllAsRead(@Request() req: any) {
    return this.service.markAllAsRead(req.user.id);
  }
}
