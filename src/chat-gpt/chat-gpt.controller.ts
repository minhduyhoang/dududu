import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatGptService } from './chat-gpt.service';

@Controller('chat-gpt')
export class ChatGptController {
  constructor(private readonly chatGptService: ChatGptService) {}

  @Post()
  create(@Body() data) {
    return this.chatGptService.create(data);
  }
}
