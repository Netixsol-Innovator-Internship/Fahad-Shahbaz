import { Injectable, Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
@Injectable()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private userSockets = new Map<string, Set<string>>();

  constructor(private jwtService: JwtService) {}

  handleConnection(client: Socket) {
    try {
      const token =
        (client.handshake.auth && client.handshake.auth.token) ||
        client.handshake.query?.token;
      if (!token) {
        this.logger.debug(`Socket ${client.id} connected without token`);
        return;
      }
      const payload: any = this.jwtService.verify(token);
      const userId = String(payload.sub);
      client.data.userId = userId;
      const set = this.userSockets.get(userId) || new Set<string>();
      set.add(client.id);
      this.userSockets.set(userId, set);
      this.logger.log(`Socket ${client.id} connected for user ${userId}`);
    } catch (err) {
      this.logger.warn('Socket auth failed: ' + err?.message || err);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (!userId) return;
    const set = this.userSockets.get(userId);
    if (!set) return;
    set.delete(client.id);
    if (set.size === 0) this.userSockets.delete(userId);
    this.logger.log(`Socket ${client.id} disconnected for user ${userId}`);
  }

  emitToUser(userId: string, event: string, payload: any) {
    const set = this.userSockets.get(String(userId));
    if (!set) return;
    for (const sid of set) {
      this.server.to(sid).emit(event, payload);
    }
  }

  emitToAll(event: string, payload: any) {
    this.server.emit(event, payload);
  }

  emitNotification(notification: any) {
    if (notification.target) {
      this.emitToUser(
        String(notification.target),
        'notification:new',
        notification,
      );
    } else {
      // broadcast to all connected users but avoid notifying the actor who created it
      const actorId = notification?.actor ? String(notification.actor) : null;
      for (const [userId, sockets] of this.userSockets.entries()) {
        if (actorId && String(userId) === actorId) continue;
        for (const sid of sockets) {
          this.server.to(sid).emit('notification:new', notification);
        }
      }
    }
  }
}
