
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CentrifugoService } from 'src/centrifugo/centrifugo.service';
import { ChatRepository } from 'src/chat/chat.repository';
import { SendMessageCommand } from '../impl/send-message.cmd';

@CommandHandler(SendMessageCommand)
export class SendMessageCmdHandler implements ICommandHandler<SendMessageCommand> {
 

  constructor(
    private readonly centrifugoService: CentrifugoService,
    private readonly chatRepository: ChatRepository,

  ) {}

  async execute(command: SendMessageCommand) {
    const payload = {
      text: command.inputArgs.message,
      createdAt: new Date().toISOString(),
    };

    this.chatRepository.addMessage(payload);

    await this.centrifugoService.publish('chat', payload);
    return { message: 'Message sent successfully' };
  }
  
}