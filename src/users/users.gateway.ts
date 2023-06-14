import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(3006, { cors: true })
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() io: Server;

  handleConnection(socket: Socket) {
    socket.join('some room');
    console.log('test asdsadasdasd', socket.id);
    this.io.emit('message', 'This is test');
  }
  handleDisconnect(socket: Socket) {}

  @SubscribeMessage('test')
  handleMessage(socket: Socket, payload: any): void {
    console.log('test asdsadasdasd');
  }

  @SubscribeMessage('message')
  handleMessageA(socket: Socket, payload: any): void {
    console.log('message', payload);
    this.io.emit('connected', 'This is test');
  }

  @SubscribeMessage('hello')
  handleMessageHello(socket: Socket, payload: any): void {
    console.log('hello', payload);
    socket.to('some room').emit('some event');
  }

  test(): void {
    this.io.to('some room').emit('some event', 'asdasdasdasdasdasd');
  }
}
