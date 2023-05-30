import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MessagesService {
  constructor(@Inject('API_SERVICE') private client: ClientProxy) {}

  sendMessage(data) {
    this.client.emit('sendMessage', data);
  }
}
