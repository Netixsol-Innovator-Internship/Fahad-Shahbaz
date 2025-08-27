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
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsGateway } from './comments.gateway';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    NotificationsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsGateway],
  exports: [CommentsService],
})
export class CommentsModule {}
