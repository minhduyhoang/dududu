import { PartialType } from '@nestjs/swagger';
import { CreateChatGptDto } from './create-chat-gpt.dto';

export class UpdateChatGptDto extends PartialType(CreateChatGptDto) {}
