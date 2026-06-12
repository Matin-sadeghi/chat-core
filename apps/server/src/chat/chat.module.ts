import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { CentrifugoModule } from "src/centrifugo/centrifugo.module";

@Module({
    imports: [CentrifugoModule],
    controllers: [ChatController],
    providers: [ChatService],
})
export class ChatModule {}