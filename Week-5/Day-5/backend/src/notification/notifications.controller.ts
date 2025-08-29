// import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
// import { NotificationService } from './notifications.service';
// import { Types } from 'mongoose';

// @Controller('notifications')
// export class NotificationController {
//   constructor(private readonly notificationService: NotificationService) {}

//   @Post()
//   async create(
//     @Body('user') user: string,
//     @Body('type') type: string,
//     @Body('message') message: string,
//     @Body('auction') auction?: string,
//   ) {
//     return this.notificationService.create(
//       new Types.ObjectId(user),
//       type,
//       message,
//       auction ? new Types.ObjectId(auction) : undefined,
//     );
//   }

//   @Get('user/:userId')
//   async findByUser(@Param('userId') userId: string) {
//     return this.notificationService.findByUser(userId);
//   }

//   @Patch(':id/read')
//   async markAsRead(@Param('id') id: string) {
//     return this.notificationService.markAsRead(id);
//   }

//   @Delete(':id')
//   async delete(@Param('id') id: string) {
//     return this.notificationService.delete(id);
//   }
// }
