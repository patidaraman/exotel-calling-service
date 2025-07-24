import { IsString, IsNotEmpty, IsPhoneNumber, IsOptional, IsEmail, IsUrl, IsArray } from 'class-validator';

// Voice Call DTOs
export class InitiateCallDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  to: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  from: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  url?: string; // TwiML URL for call flow

  @IsString()
  @IsOptional()
  method?: 'GET' | 'POST';

  @IsString()
  @IsOptional()
  @IsUrl()
  statusCallback?: string;

  @IsString()
  @IsOptional()
  statusCallbackMethod?: 'GET' | 'POST';

  @IsString()
  @IsOptional()
  record?: 'true' | 'false';

  @IsString()
  @IsOptional()
  timeout?: string;
}

// SMS DTOs
export class SendSmsDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  to: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  from: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  statusCallback?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  mediaUrl?: string;
}

// WhatsApp DTOs
export class SendWhatsAppDto {
  @IsString()
  @IsNotEmpty()
  to: string; // whatsapp:+1234567890

  @IsString()
  @IsNotEmpty()
  from: string; // whatsapp:+1234567890

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  mediaUrl?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  statusCallback?: string;
}

// Bulk WhatsApp DTO
export class BulkWhatsAppDto {
  @IsArray()
  @IsNotEmpty()
  phoneNumbers: string[]; // Array of phone numbers

  @IsString()
  @IsNotEmpty()
  from: string; // whatsapp:+1234567890

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  mediaUrl?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  statusCallback?: string;

  @IsString()
  @IsOptional()
  delayBetweenMessages?: string; // Delay in seconds between messages
}

// Email DTOs (using SendGrid)
export class SendEmailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsEmail()
  @IsNotEmpty()
  from: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsOptional()
  html?: string;

  @IsArray()
  @IsOptional()
  attachments?: Array<{
    filename: string;
    content: string;
    type: string;
  }>;
}

// Common Response DTO
export class TwilioResponseDto {
  success: boolean;
  sid?: string;
  message: string;
  data?: any;
  error?: any;
}

// Webhook DTOs
export class TwilioWebhookDto {
  @IsString()
  @IsOptional()
  CallSid?: string;

  @IsString()
  @IsOptional()
  MessageSid?: string;

  @IsString()
  @IsOptional()
  From?: string;

  @IsString()
  @IsOptional()
  To?: string;

  @IsString()
  @IsOptional()
  CallStatus?: string;

  @IsString()
  @IsOptional()
  MessageStatus?: string;

  @IsString()
  @IsOptional()
  Body?: string;

  @IsString()
  @IsOptional()
  Digits?: string;

  @IsString()
  @IsOptional()
  RecordingUrl?: string;

  @IsString()
  @IsOptional()
  CallDuration?: string;
}