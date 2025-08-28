import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private notifications: NotificationsService,
  ) {}

  async create(
    authorId: string,
    content: string,
    postId?: string,
    parent?: string,
  ) {
    const doc = new this.commentModel({
      author: new Types.ObjectId(authorId),
      content,
      postId: postId || null,
      parent: parent || null,
    });
    const saved = await doc.save();
    // prepare notification payload: include a short snippet of the comment
    const snippet = typeof content === 'string' ? content.slice(0, 200) : '';
    try {
      if (parent) {
        // notify only the parent comment's author that they were replied to
        const parentDoc = await this.commentModel.findById(parent).exec();
        const target = parentDoc ? (parentDoc.author as any) : null;
        // avoid notifying the replier themselves
        if (target && String(target) !== String(authorId)) {
          await this.notifications.create(
            'reply',
            new Types.ObjectId(authorId),
            new Types.ObjectId(String(target)),
            { commentId: saved._id, snippet },
          );
        }
      } else {
        // broadcast a new comment notification to all users (gateway will skip actor)
        await this.notifications.create(
          'comment',
          new Types.ObjectId(authorId),
          null,
          { commentId: saved._id, snippet },
        );
      }
    } catch (err) {
      // don't let notification errors block comment creation
      // intentionally swallow errors and log in production
    }
    // populate author before returning so frontend receives username/avatar
    const populated = await this.commentModel
      .findById(saved._id)
      .populate('author', 'username avatarUrl')
      .exec();
    return populated || saved;
  }

  async listByPost(postId: string) {
    // default to returning latest 50
    const docs = await this.commentModel
      .find({ postId })
      .populate('author', 'username avatarUrl')
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
    return docs;
  }

  async listAll() {
    // return latest 50 comments across all posts
    const docs = await this.commentModel
      .find({})
      .populate('author', 'username avatarUrl')
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
    return docs;
  }

  async like(commentId: string, userId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('comment not found');
    const uid = new Types.ObjectId(userId);
    const exists = comment.likes.find((l) => l.equals(uid));
    if (exists) {
      // unlike
      comment.likes = comment.likes.filter((l) => !l.equals(uid));
      var liked = false;
    } else {
      comment.likes.push(uid);
      var liked = true;
      // notify owner if liker is not the owner
      try {
        const authorId = String(comment.author);
        if (String(uid) !== String(authorId)) {
          // include a short snippet so notifications can show meaningful text
          const snippet =
            typeof comment.content === 'string'
              ? (comment.content as string).slice(0, 200)
              : '';
          await this.notifications.create('like', uid, comment.author as any, {
            commentId,
            snippet,
          });
        }
      } catch (e) {
        // ignore notification errors
      }
    }
    comment.likesCount = comment.likes.length;
    await comment.save();
    return { likesCount: comment.likesCount, liked };
  }
}
