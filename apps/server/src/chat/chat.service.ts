import { Injectable } from "@nestjs/common";

@Injectable()
export class ChatService {
    constructor() {}

    async sendMessage(message: string) {
        return message;
    }
}