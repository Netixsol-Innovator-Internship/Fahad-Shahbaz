import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import { NotificationsGateway } from './notifications.gateway';
import { Comment, CommentDocument } from '../comments/schemas/comment.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notifModel: Model<NotificationDocument>,
    @InjectModel(Comment.name)
    private commentModel: Model<CommentDocument>,
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
    // populate actor fields so clients receive readable actor info
    const nots = await this.notifModel
      .find({ target })
      .sort({ createdAt: -1 })
      .populate('actor', 'username avatarUrl')
      .exec();

    // if any 'like' notifications are missing a snippet, fetch the comment content to attach a short snippet
    const promises = nots.map(async (n: any) => {
      try {
        if (
          n.type === 'like' &&
          n.data &&
          !n.data.snippet &&
          n.data.commentId
        ) {
          const cid = String(n.data.commentId);
          const c = await this.commentModel.findById(cid).exec();
          if (c && typeof c.content === 'string') {
            n.data.snippet = (c.content || '').slice(0, 200);
          }
        }
      } catch (e) {
        // ignore
      }
      return n;
    });
    await Promise.all(promises);
    return nots;
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
