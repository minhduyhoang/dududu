import { forwardRef, Inject } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UsersService } from "./users.service";

@WebSocketGateway(3006, {
  transports: ["websocket", "polling", "flashsocket"],
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
})
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() io: Server;

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async handleConnection(socket: Socket) {
    // socket.join('some room');
    // console.log('test asdsadasdasd', socket.id);
    // this.io.emit('message', 'This is test');
    await this.usersService.getUserFromSocket(socket);
  }
  handleDisconnect(socket: Socket) {}

  @SubscribeMessage("connected-socket")
  handleMessage(socket: Socket, payload: any): void {
    console.log("test asdsadasdasd");
  }

  @SubscribeMessage("message")
  handleMessageA(socket: Socket, payload: any): void {
    console.log("message", payload);
    this.io.emit("connected", "This is test");
  }

  @SubscribeMessage("hello")
  handleMessageHello(socket: Socket, payload: any): void {
    console.log("hello", payload);
    socket.to("some room").emit("some event");
  }

  test(): void {
    this.io.to("some room").emit("some event", "asdasdasdasdasdasd");
  }

  // @UseGuards(AuthGuard)
  // @SubscribeMessage('events')
  // handleEvent(client: Client, data: unknown): WsResponse<unknown> {
  //   const event = 'events';
  //   return { event, data };
  // }
}
