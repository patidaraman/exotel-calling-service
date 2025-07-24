import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AIPoweredAdlyncChatbotService } from './services/ai-powered-adlync-chatbot.service';

export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  message: string;
  suggestedActions?: string[];
}

@Controller('chatbot')
export class SimpleChatbotController {
  constructor(
    private readonly chatbotService: AIPoweredAdlyncChatbotService,
  ) {}

  @Get('health')
  async health() {
    return {
      status: 'ok',
      service: 'chatbot',
      timestamp: new Date().toISOString(),
      message: 'Chatbot service is running',
    };
  }

  @Post('chat')
  async chat(@Body() chatRequest: ChatRequest): Promise<ChatResponse> {
    try {
      const { message, sessionId } = chatRequest;

      if (!message || message.trim().length === 0) {
        throw new HttpException('Message is required', HttpStatus.BAD_REQUEST);
      }

      const response = await this.chatbotService.processMessage(
        message.trim(),
        sessionId || 'default-session',
      );

      return {
        message: response.message,
        suggestedActions: response.suggestedActions || [],
      };
    } catch (error) {
      console.error('Chatbot error:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}