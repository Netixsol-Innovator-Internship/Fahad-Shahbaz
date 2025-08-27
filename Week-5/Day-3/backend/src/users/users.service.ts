import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private notifications: NotificationsService,
  ) {}

  async create(username: string, email: string, password: string) {
    const existing = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existing)
      throw new BadRequestException('username or email already exists');
    const hash = await bcrypt.hash(password, 10);
    const created = new this.userModel({ username, email, passwordHash: hash });
    return created.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async validatePassword(email: string, plain: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(plain, user.passwordHash);
    return ok ? user : null;
  }

  async follow(actorId: string, targetId: string) {
    if (actorId === targetId)
      throw new BadRequestException('cannot follow yourself');
    const actor = await this.userModel.findById(actorId);
    const target = await this.userModel.findById(targetId);
    if (!actor || !target) throw new BadRequestException('user not found');

    const tId = new Types.ObjectId(targetId);
    const aId = new Types.ObjectId(actorId);

    // add to following/followers if not present
    if (!actor.following.find((x) => String(x) === String(tId))) {
      actor.following.push(tId);
    }
    if (!target.followers.find((x) => String(x) === String(aId))) {
      target.followers.push(aId);
    }

    await actor.save();
    await target.save();

    // create a notification for the target
    try {
      await this.notifications.create('follow', aId, tId, {});
      // emit follow event for realtime UI updates
      try {
        this.notifications.emitFollowEvent(aId, tId, 'follow');
      } catch (e) {
        // ignore
      }
    } catch (err) {
      // ignore notification errors
      console.warn('follow notification failed', err?.message || err);
    }

    return { ok: true };
  }

  async unfollow(actorId: string, targetId: string) {
    if (actorId === targetId)
      throw new BadRequestException('cannot unfollow yourself');
    const actor = await this.userModel.findById(actorId);
    const target = await this.userModel.findById(targetId);
    if (!actor || !target) throw new BadRequestException('user not found');

    const tId = String(targetId);
    const aId = String(actorId);

    actor.following = actor.following.filter((x) => String(x) !== tId);
    target.followers = target.followers.filter((x) => String(x) !== aId);

    await actor.save();
    await target.save();

    // emit unfollow event so clients can update counts
    try {
      this.notifications.emitFollowEvent(
        new Types.ObjectId(actorId),
        new Types.ObjectId(targetId),
        'unfollow',
      );
    } catch (e) {
      // ignore
    }

    return { ok: true };
  }

  async listFollowers(userId: string, limit = 50, skip = 0) {
    const user = await this.userModel.findById(userId).lean().exec();
    if (!user) return [];
    const ids = (user.followers || [])
      .slice(skip, skip + limit)
      .map((x) => String(x));
    const users = await this.userModel
      .find({ _id: { $in: ids } })
      .lean()
      .exec();
    return users.map((u) => ({
      id: u._id,
      username: u.username,
      avatarUrl: u.avatarUrl,
    }));
  }

  async listFollowing(userId: string, limit = 50, skip = 0) {
    const user = await this.userModel.findById(userId).lean().exec();
    if (!user) return [];
    const ids = (user.following || [])
      .slice(skip, skip + limit)
      .map((x) => String(x));
    const users = await this.userModel
      .find({ _id: { $in: ids } })
      .lean()
      .exec();
    return users.map((u) => ({
      id: u._id,
      username: u.username,
      avatarUrl: u.avatarUrl,
    }));
  }
}
