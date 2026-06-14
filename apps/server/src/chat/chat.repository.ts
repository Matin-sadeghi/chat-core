import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatRepository {

  private messages: { text: string; createdAt: string }[] = [];

 addMessage(message: { text: string; createdAt: string }) {
  this.messages.push(message);
 }
 getAllMessages(): { text: string; createdAt: string }[] {
  return this.messages;
 }
}