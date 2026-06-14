import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SendMessageDto } from 'src/dtos/send-message.dto';
import { SendMessageCommand } from './cqrs/commands/impl/send-message.cmd';
import { GetMessagesQuery } from './cqrs/queries/impl/get-messages.query';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  findAll() {
    return this.queryBus.execute(new GetMessagesQuery());
  }

  @Post()
  send(
    @Body() body: SendMessageDto,
  ) {
    return this.commandBus.execute(new SendMessageCommand({ message: body.message }));
  }
}