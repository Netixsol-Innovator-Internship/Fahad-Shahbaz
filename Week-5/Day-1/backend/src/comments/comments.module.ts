// import { Module } from '@nestjs/common';
// import { CommentsController } from './comments.controller';
// import { CommentsService } from './comments.service';
// import { CommentsGateway } from './comments/comments.gateway';

// @Module({
//   controllers: [CommentsController],
//   providers: [CommentsService, CommentsGateway]
// })
// export class CommentsModule {}


import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsGateway } from './comments.gateway';


@Module({
controllers: [CommentsController],
providers: [CommentsService, CommentsGateway],
})
export class CommentsModule {}