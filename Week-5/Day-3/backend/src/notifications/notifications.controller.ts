import { Controller, Get, Req, UseGuards, Post, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async list(@Req() req: any) {
    const userId = req.user?.userId;
    if (!userId) return { ok: false, error: 'unauthenticated' };
    const notifications = await this.notifications.listForUser(userId);
    return { ok: true, notifications };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/read')
  async markRead(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.userId;
    if (!userId) return { ok: false, error: 'unauthenticated' };
    return this.notifications.markRead(id, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('read-all')
  async markAllRead(@Req() req: any) {
    const userId = req.user?.userId;
    if (!userId) return { ok: false, error: 'unauthenticated' };
    return this.notifications.markAllRead(userId);
  }
}
