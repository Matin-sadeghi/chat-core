import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from 'src/dtos/send-message.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
  ) {}

  @Get()
  findAll() {
    return this.chatService.getMessages();
  }

  @Post()
  send(
    @Body() body: SendMessageDto,
  ) {
    return this.chatService.send(body.message);
  }
}