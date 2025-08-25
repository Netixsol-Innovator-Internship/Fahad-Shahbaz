// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class CommentsService {}

import { Injectable } from '@nestjs/common';
import { Comment, CreateCommentDto } from './comments.types';
import { randomUUID } from 'crypto';


@Injectable()
export class CommentsService {
private comments: Comment[] = [];


list(): Comment[] {
// newest first
return [...this.comments].sort((a, b) => b.createdAt - a.createdAt);
}


add(dto: CreateCommentDto): Comment {
const comment: Comment = {
id: randomUUID(),
text: dto.text,
author: dto.author,
clientId: dto.clientId,
createdAt: Date.now(),
};
this.comments.push(comment);
return comment;
}
}