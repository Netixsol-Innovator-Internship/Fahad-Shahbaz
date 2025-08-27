import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { CommentsGateway } from './comments.gateway';

class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  postId?: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly svc: CommentsService,
    private readonly gw: CommentsGateway,
  ) {}

  @Get()
  async listAll(@Req() req: any) {
    const userId = req.user?.userId || null;
    const docs = await this.svc.listAll();
    if (!userId) return docs;
    // annotate likedByCurrentUser
    return docs.map((d: any) => {
      const id = String(d._id ?? d.id);
      const liked = Array.isArray(d.likes)
        ? d.likes.some((l: any) => String(l) === String(userId))
        : false;
      return { ...(d.toObject?.() ?? d), likedByCurrentUser: liked };
    });
  }

  @Get(':postId')
  async list(@Req() req: any, @Param('postId') postId: string) {
    const userId = req.user?.userId || null;
    const docs = await this.svc.listByPost(postId);
    if (!userId) return docs;
    return docs.map((d: any) => {
      const liked = Array.isArray(d.likes)
        ? d.likes.some((l: any) => String(l) === String(userId))
        : false;
      return { ...(d.toObject?.() ?? d), likedByCurrentUser: liked };
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Req() req: any, @Body() body: CreateCommentDto) {
    const userId = req.user?.userId;
    if (!userId) return { ok: false, error: 'unauthenticated' };
    if (!body?.content) return { ok: false, error: 'content required' };
    const comment = await this.svc.create(
      userId,
      body.content,
      body.postId,
      body.parentId,
    );
    this.gw.emitNewComment(comment);
    return { ok: true, comment };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/like')
  async like(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.userId;
    if (!userId) return { ok: false, error: 'unauthenticated' };
    const res = await this.svc.like(id, userId);
    // emit socket event so other clients can update likes live
    try {
      this.gw.emitLike(id, res.likesCount ?? 0);
    } catch (e) {}
    return { ok: true, ...res };
  }
}
