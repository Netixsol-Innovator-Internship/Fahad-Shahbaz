// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { Notification, NotificationDocument } from './schemas/notification.schema';

// @Injectable()
// export class NotificationService {
//   constructor(
//     @InjectModel(Notification.name)
//     private notificationModel: Model<NotificationDocument>,
//   ) {}

//   async create(
//     user: Types.ObjectId,
//     type: string,
//     message: string,
//     auction?: Types.ObjectId,
//   ): Promise<Notification> {
//     const newNotification = new this.notificationModel({
//       user,
//       type,
//       message,
//       auction,
//     });
//     return newNotification.save();
//   }

//   async findByUser(userId: string): Promise<Notification[]> {
//     return this.notificationModel
//       .find({ user: userId })
//       .sort({ createdAt: -1 })
//       .exec();
//   }

//   async markAsRead(id: string): Promise<Notification> {
//     const notification = await this.notificationModel.findById(id);
//     if (!notification) throw new NotFoundException('Notification not found');
//     notification.read = true;
//     return notification.save();
//   }

//   async delete(id: string): Promise<void> {
//     const result = await this.notificationModel.findByIdAndDelete(id).exec();
//     if (!result) throw new NotFoundException('Notification not found');
//   }
// }
