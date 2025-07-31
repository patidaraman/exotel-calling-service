import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Logger,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { VapiService, VapiCallRequest, VapiCallResponse } from './vapi.service';

import { IsString, IsOptional, IsObject } from 'class-validator';

export class InitiateVapiCallDto {
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  assistantId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class VapiChatDto {
  @IsString()
  message: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  assistantId?: string;
}

@Controller('vapi')
export class VapiController {
  private readonly logger = new Logger(VapiController.name);

  constructor(private readonly vapiService: VapiService) {}

  // Create AI Assistant
  @Post('create-assistant')
  @HttpCode(HttpStatus.OK)
  async createAssistant(): Promise<VapiCallResponse> {
    this.logger.log('🎙️ Creating Vapi AI Assistant for Adlync Solutions');
    return this.vapiService.createAssistant();
  }

  // List All Assistants
  @Get('assistants')
  async listAssistants(): Promise<VapiCallResponse> {
    this.logger.log('📋 Fetching all Vapi assistants');
    return this.vapiService.listAssistants();
  }

  // List Phone Numbers
  @Get('phone-numbers')
  async listPhoneNumbers(): Promise<VapiCallResponse> {
    this.logger.log('📞 Fetching all Vapi phone numbers');
    return this.vapiService.listPhoneNumbers();
  }

  // Initiate AI Voice Call
  @Post('initiate-call')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async initiateCall(
    @Body() callData: InitiateVapiCallDto,
  ): Promise<VapiCallResponse> {
    this.logger.log(
      `🎙️ Initiating Vapi AI call to: ${callData.phoneNumber}`,
    );

    const callRequest: VapiCallRequest = {
      phoneNumber: callData.phoneNumber,
      assistantId: callData.assistantId,
      customerName: callData.customerName,
      customerEmail: callData.customerEmail,
      metadata: {
        source: 'adlync-website',
        timestamp: new Date().toISOString(),
        ...callData.metadata,
      },
    };

    return this.vapiService.initiateCall(callRequest);
  }

  // Get Call Status
  @Get('call-status/:callId')
  async getCallStatus(
    @Param('callId') callId: string,
  ): Promise<VapiCallResponse> {
    this.logger.log(`📞 Fetching call status for: ${callId}`);
    return this.vapiService.getCallStatus(callId);
  }

  // Test Endpoint - Initiate Call to Verified Number
  @Post('test-call')
  @HttpCode(HttpStatus.OK)
  async testCall(): Promise<VapiCallResponse> {
    this.logger.log('🧪 Initiating test Vapi call');

    // Use one of your verified Twilio numbers for testing
    const testCallRequest: VapiCallRequest = {
      phoneNumber: '+917566873233', // Replace with your verified number
      customerName: 'Test Customer',
      customerEmail: 'test@adlyncsolutions.com',
      metadata: {
        source: 'test-call',
        type: 'demo',
      },
    };

    return this.vapiService.initiateCall(testCallRequest);
  }

  // Webhook for Vapi Events
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleVapiWebhook(@Body() body: any): Promise<{ status: string }> {
    this.logger.log('🎙️ Vapi webhook received');
    this.logger.log('Webhook data:', JSON.stringify(body, null, 2));

    // Handle different Vapi events
    switch (body.type) {
      case 'call-started':
        this.logger.log(`📞 Call started: ${body.call?.id}`);
        break;
      case 'call-ended':
        this.logger.log(`📞 Call ended: ${body.call?.id}`);
        this.logger.log(`Duration: ${body.call?.duration} seconds`);
        break;
      case 'transcript':
        this.logger.log(`💬 Transcript: ${body.transcript?.text}`);
        break;
      case 'function-call':
        this.logger.log(`🔧 Function called: ${body.functionCall?.name}`);
        break;
      default:
        this.logger.log(`📨 Unknown event type: ${body.type}`);
    }

    return { status: 'OK' };
  }

  // VAPI Assistant Chat (uses your exact VAPI prompt)
  @Post('assistant-chat')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async chatWithAssistant(
    @Body() chatData: VapiChatDto,
  ): Promise<any> {
    this.logger.log(
      `💬 VAPI Assistant chat from user: ${chatData.userId}`,
    );
    this.logger.log(`📝 Message: ${chatData.message}`);

    return this.vapiService.chatWithAssistant(chatData);
  }

  // Health Check
  @Get('health')
  healthCheck(): { status: string; timestamp: string; service: string } {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Vapi AI Voice Service',
    };
  }
}