import { Module } from '@nestjs/common';
import { HandleMessageController } from './handle-messages.controller';
import { HandleMessagesService } from './handle-messages.service';

@Module({
  controllers: [HandleMessageController],
  providers: [HandleMessagesService],
  exports: [HandleMessagesService],
})
export class HandleMessagesModule {}
