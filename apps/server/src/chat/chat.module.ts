import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ChatController } from "./chat.controller";
import { ChatRepository } from "./chat.repository";
import { CentrifugoModule } from "src/centrifugo/centrifugo.module";
import { SendMessageCmdHandler } from "./cqrs/commands/handler/send-message.cmd.handler";
import { GetMessagesQueryHandler } from "./cqrs/queries/handler/get-messages.query.handler";

@Module({
    imports: [CentrifugoModule, CqrsModule],
    controllers: [ChatController],
    providers: [ChatRepository, SendMessageCmdHandler, GetMessagesQueryHandler],
})
export class ChatModule {}