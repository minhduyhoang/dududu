import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

@WebSocketGateway()
export class SessionsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() io: Server;
  handleConnection(socket: Socket) {
    this.io.emit("message", "This is test");
  }
  handleDisconnect(socket: Socket) {}

  afterInit(server: Server) {}

  @SubscribeMessage("test")
  handleMessage(socket: Socket, payload: any): void {}
}
