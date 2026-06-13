import { Injectable } from '@nestjs/common';
import { CentrifugoService } from '../centrifugo/centrifugo.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly centrifugoService: CentrifugoService,
  ) {}

  private messages: any[] = [];

  async send(message: string) {
    const payload = {
      text: message,
      createdAt: new Date().toISOString(),
    };

    this.messages.push(payload);

    await this.centrifugoService.publish('chat', payload);

    return payload;
  }

  getMessages() {
    return this.messages;
  }
}