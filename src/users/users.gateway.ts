import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() io: Server;
  handleConnection(socket: Socket) {
    this.io.emit('message', 'This is test');
  }
  handleDisconnect(socket: Socket) {}

  @SubscribeMessage('test')
  handleMessage(socket: Socket, payload: any): void {
  }
}
