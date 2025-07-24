import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SimpleChatbotController } from './simple-chatbot.controller';
import { AIPoweredAdlyncChatbotService } from './services/ai-powered-adlync-chatbot.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  controllers: [SimpleChatbotController],
  providers: [AIPoweredAdlyncChatbotService],
  exports: [AIPoweredAdlyncChatbotService],
})
export class SimpleChatbotModule {}