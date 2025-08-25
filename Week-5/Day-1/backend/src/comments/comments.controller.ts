import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsGateway } from './comments.gateway';
import type { CreateCommentDto } from './comments.types';


@Controller('comments')
export class CommentsController {
constructor(
private readonly svc: CommentsService,
private readonly gw: CommentsGateway,
) {}


@Get()
list() {
return this.svc.list();
}


@Post()
create(@Body() body: CreateCommentDto) {
if (!body?.text || !body?.author || !body?.clientId) {
return { ok: false, error: 'text, author, clientId required' };
}
const comment = this.svc.add(body);
this.gw.emitNewComment(comment);
return { ok: true, comment };
}
}