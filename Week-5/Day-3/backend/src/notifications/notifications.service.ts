import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notifModel: Model<NotificationDocument>,
    private gateway: NotificationsGateway,
  ) {}

  async create(
    type: string,
    actor: Types.ObjectId,
    target: Types.ObjectId | null,
    data: any,
  ) {
    // don't write an explicit `target: null` into the document - some
    // mongoose schemas or validators can treat null as missing and trigger
    // a required validator. Only include `target` when it's a real id.
    const payload: any = { type, actor, data };
    if (target) payload.target = target;
    const n = new this.notifModel(payload);
    const saved = await n.save();
    try {
      // populate actor (username/avatar) before emitting so clients receive readable actor info
      const populated = await this.notifModel
        .findById(saved._id)
        .populate('actor', 'username avatarUrl')
        .exec();
      this.gateway.emitNotification(populated || saved);
    } catch (err) {
      // don't fail creation if gateway emit fails
      console.warn('failed to emit notification', err?.message || err);
    }
    return saved;
  }

  emitFollowEvent(
    actor: Types.ObjectId,
    target: Types.ObjectId,
    action: 'follow' | 'unfollow',
  ) {
    try {
      const payload = {
        type: action,
        actor: String(actor),
        target: String(target),
        createdAt: new Date(),
      };
      // send targeted event and a broadcast (clients can decide whether to act)
      this.gateway.emitToUser(String(target), 'user:follow', payload);
      this.gateway.emitToAll('user:follow', payload);
    } catch (err) {
      console.warn('emitFollowEvent failed', err?.message || err);
    }
  }

  async listForUser(userId: string) {
    // try to cast to ObjectId when possible (works with real Mongo IDs)
    let target: any = userId;
    try {
      target = new Types.ObjectId(String(userId));
    } catch (err) {
      target = userId;
    }
    return this.notifModel
      .find({ target })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async markRead(notificationId: string, userId: string) {
    const finder = this.notifModel.findById(notificationId);
    const n =
      typeof finder.exec === 'function' ? await finder.exec() : await finder;
    if (!n) return { ok: false, error: 'not found' };
    if (String(n.target) !== String(userId))
      return { ok: false, error: 'not authorized' };
    n.read = true;
    await n.save();
    return { ok: true };
  }

  async markAllRead(userId: string) {
    await this.notifModel
      .updateMany({ target: userId, read: false }, { $set: { read: true } })
      .exec();
    return { ok: true };
  }
}
