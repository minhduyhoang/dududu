import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { HandleMessagesService } from "./handle-messages.service";

@Controller("handle-messages")
export class HandleMessageController {
  constructor(private readonly handleMessagesService: HandleMessagesService) {}

  @EventPattern("test")
  async test(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.handleMessagesService.test(data);
      channel.ack(originalMsg);
    } catch (err) {
      channel.nack(originalMsg);
    }
  }
}
