// import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

// @WebSocketGateway()
// export class CommentsGateway {
//   @SubscribeMessage('message')
//   handleMessage(client: any, payload: any): string {
//     return 'Hello world!';
//   }
// }

export interface Comment {
  id: string;
  text: string;
  author: string;
  clientId: string; // frontend sender id
  createdAt: number;
}

export interface CreateCommentDto {
  text: string;
  author: string;
  clientId: string;
}

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://realtimefrontend.vercel.app', // <-- add your deployed frontend URL here
    ],
    credentials: true,
  },
  transports: ['websocket'],
})
export class CommentsGateway {
  @WebSocketServer()
  server!: Server;

  emitNewComment(payload: any) {
    this.server.emit('new_comment', payload);
  }
}
