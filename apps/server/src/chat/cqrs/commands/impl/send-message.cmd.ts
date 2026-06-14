import { Command } from '@nestjs/cqrs';


export class SendMessageCommand extends Command<{
  message: string;
}> {
  constructor(public readonly inputArgs: { message: string }) {
    super();
  }
}
