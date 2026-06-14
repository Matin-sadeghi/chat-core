import { ChatRepository } from "src/chat/chat.repository";
import { GetMessagesQuery } from "../impl/get-messages.query";
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetMessagesQuery)
export class GetMessagesQueryHandler implements IQueryHandler<GetMessagesQuery> {
  constructor(private readonly chatRepository: ChatRepository) {}
  async execute(): Promise<{ text: string; createdAt: string }[]> {
    const messages = this.chatRepository.getAllMessages();
    console.log(messages);
    return  messages ;
  }
}