import { Query } from '@nestjs/cqrs';


export class GetMessagesQuery extends Query<{ text: string; createdAt: string }[]> {
  constructor() {
    super();
  }
}