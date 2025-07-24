import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import * as qs from 'qs';
import {
  InitiateCallDto,
  SendSmsDto,
  SendWhatsAppDto,
  SendEmailDto,
  BulkWhatsAppDto,
  TwilioResponseDto,
} from './dto/twilio.dto';

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);
  private readonly accountSid: string;
  private readonly authToken: string;
  private readonly baseUrl: string;
  private readonly sendGridApiKey: string;
  private readonly appBaseUrl: string;

  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.accountSid = this.config.get<string>('twilio.accountSid');
    this.authToken = this.config.get<string>('twilio.authToken');
    this.sendGridApiKey = this.config.get<string>('twilio.sendGridApiKey');
    this.appBaseUrl = this.config.get<string>('app.baseUrl');
    this.baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}`;

    this.validateConfiguration();
  }

  private validateConfiguration(): void {
    const requiredConfigs = [
      { key: 'accountSid', value: this.accountSid },
      { key: 'authToken', value: this.authToken },
    ];

    const missingConfigs = requiredConfigs.filter(config => !config.value);
    
    if (missingConfigs.length > 0) {
      const missingKeys = missingConfigs.map(config => config.key).join(', ');
      throw new Error(`Missing required Twilio configuration: ${missingKeys}`);
    }

    // Log what's available for testing
    this.logger.log('🔍 Twilio Configuration Status:');
    this.logger.log(`✅ Account SID: ${this.accountSid ? 'Configured' : 'Missing'}`);
    this.logger.log(`✅ Auth Token: ${this.authToken ? 'Configured' : 'Missing'}`);
    this.logger.log(`📞 Phone Number: ${this.config.get<string>('twilio.phoneNumber') ? 'Configured' : 'Not configured (optional for testing)'}`);
    this.logger.log(`💬 WhatsApp Number: ${this.config.get<string>('twilio.whatsappNumber') ? 'Configured' : 'Not configured (optional for testing)'}`);
    this.logger.log(`📧 SendGrid API Key: ${this.sendGridApiKey ? 'Configured' : 'Not configured (optional for testing)'}`);
  }

  // Voice Call Methods
  async initiateCall(callData: InitiateCallDto): Promise<TwilioResponseDto> {
    try {
      this.logger.log(`Initiating call from ${callData.from} to ${callData.to}`);

      // Debug: Check if we have a proper app base URL
      const webhookUrl = callData.url || `${this.appBaseUrl}/twilio/voice-response`;
      
      console.log('🔍 DEBUG - Call Configuration:');
      console.log('App Base URL:', this.appBaseUrl);
      console.log('Webhook URL:', webhookUrl);
      console.log('To:', callData.to);
      console.log('From:', callData.from);

      const payload = qs.stringify({
        To: callData.to,
        From: callData.from,
        Url: webhookUrl,
        Method: callData.method || 'POST',
        StatusCallback: callData.statusCallback || `${this.appBaseUrl}/twilio/call-status`,
        StatusCallbackMethod: callData.statusCallbackMethod || 'POST',
        Record: callData.record || 'false',
        Timeout: callData.timeout || '60',
      });

      console.log('🔍 DEBUG - Twilio Call Request:');
      console.log('Account SID:', this.accountSid);
      console.log('Payload:', payload);

      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/Calls.json`, payload, {
          auth: {
            username: this.accountSid,
            password: this.authToken,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 10000,
        }),
      );

      this.logger.log(`Call initiated successfully. CallSid: ${response.data?.sid}`);

      return {
        success: true,
        sid: response.data?.sid,
        message: 'Call initiated successfully',
        data: response.data,
      };

    } catch (error) {
      return this.handleError(error, 'Failed to initiate call');
    }
  }

  async getCallStatus(callSid: string): Promise<TwilioResponseDto> {
    try {
      this.logger.log(`Fetching call status for CallSid: ${callSid}`);

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/Calls/${callSid}.json`, {
          auth: {
            username: this.accountSid,
            password: this.authToken,
          },
          timeout: 10000,
        }),
      );

      return {
        success: true,
        sid: callSid,
        message: 'Call status retrieved successfully',
        data: response.data,
      };

    } catch (error) {
      return this.handleError(error, `Failed to get call status for CallSid: ${callSid}`);
    }
  }

  // SMS Methods
  async sendSms(smsData: SendSmsDto): Promise<TwilioResponseDto> {
    try {
      this.logger.log(`Sending SMS from ${smsData.from} to ${smsData.to}`);

      const payload = qs.stringify({
        To: smsData.to,
        From: smsData.from,
        Body: smsData.body,
        StatusCallback: smsData.statusCallback || `${this.appBaseUrl}/twilio/sms-status`,
        ...(smsData.mediaUrl && { MediaUrl: smsData.mediaUrl }),
      });

      console.log('🔍 DEBUG - Twilio SMS Request:');
      console.log('Payload:', payload);

      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/Messages.json`, payload, {
          auth: {
            username: this.accountSid,
            password: this.authToken,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 10000,
        }),
      );

      this.logger.log(`SMS sent successfully. MessageSid: ${response.data?.sid}`);

      return {
        success: true,
        sid: response.data?.sid,
        message: 'SMS sent successfully',
        data: response.data,
      };

    } catch (error) {
      return this.handleError(error, 'Failed to send SMS');
    }
  }

  async getSmsStatus(messageSid: string): Promise<TwilioResponseDto> {
    try {
      this.logger.log(`Fetching SMS status for MessageSid: ${messageSid}`);

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/Messages/${messageSid}.json`, {
          auth: {
            username: this.accountSid,
            password: this.authToken,
          },
          timeout: 10000,
        }),
      );

      return {
        success: true,
        sid: messageSid,
        message: 'SMS status retrieved successfully',
        data: response.data,
      };

    } catch (error) {
      return this.handleError(error, `Failed to get SMS status for MessageSid: ${messageSid}`);
    }
  }

  // WhatsApp Methods
  async sendWhatsApp(whatsAppData: SendWhatsAppDto): Promise<TwilioResponseDto> {
    try {
      this.logger.log(`Sending WhatsApp from ${whatsAppData.from} to ${whatsAppData.to}`);

      const payload = qs.stringify({
        To: whatsAppData.to.startsWith('whatsapp:') ? whatsAppData.to : `whatsapp:${whatsAppData.to}`,
        From: whatsAppData.from.startsWith('whatsapp:') ? whatsAppData.from : `whatsapp:${whatsAppData.from}`,
        Body: whatsAppData.body,
        StatusCallback: whatsAppData.statusCallback || `${this.appBaseUrl}/twilio/whatsapp-status`,
        ...(whatsAppData.mediaUrl && { MediaUrl: whatsAppData.mediaUrl }),
      });

      console.log('🔍 DEBUG - Twilio WhatsApp Request:');
      console.log('Payload:', payload);

      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/Messages.json`, payload, {
          auth: {
            username: this.accountSid,
            password: this.authToken,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 10000,
        }),
      );

      this.logger.log(`WhatsApp sent successfully. MessageSid: ${response.data?.sid}`);

      return {
        success: true,
        sid: response.data?.sid,
        message: 'WhatsApp message sent successfully',
        data: response.data,
      };

    } catch (error) {
      return this.handleError(error, 'Failed to send WhatsApp message');
    }
  }

  // Bulk WhatsApp Methods
  async sendBulkWhatsApp(bulkData: BulkWhatsAppDto): Promise<TwilioResponseDto> {
    try {
      this.logger.log(`Sending bulk WhatsApp to ${bulkData.phoneNumbers.length} numbers`);

      const delay = parseInt(bulkData.delayBetweenMessages || '2'); // Default 2 seconds delay
      const results = [];
      const errors = [];

      for (let i = 0; i < bulkData.phoneNumbers.length; i++) {
        const phoneNumber = bulkData.phoneNumbers[i];
        
        try {
          this.logger.log(`Sending WhatsApp ${i + 1}/${bulkData.phoneNumbers.length} to ${phoneNumber}`);

          const payload = qs.stringify({
            To: phoneNumber.startsWith('whatsapp:') ? phoneNumber : `whatsapp:${phoneNumber}`,
            From: bulkData.from.startsWith('whatsapp:') ? bulkData.from : `whatsapp:${bulkData.from}`,
            Body: bulkData.body,
            StatusCallback: bulkData.statusCallback || `${this.appBaseUrl}/twilio/whatsapp-status`,
            ...(bulkData.mediaUrl && { MediaUrl: bulkData.mediaUrl }),
          });

          const response = await firstValueFrom(
            this.httpService.post(`${this.baseUrl}/Messages.json`, payload, {
              auth: {
                username: this.accountSid,
                password: this.authToken,
              },
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              timeout: 10000,
            }),
          );

          results.push({
            phoneNumber,
            success: true,
            messageSid: response.data?.sid,
            status: response.data?.status,
          });

          this.logger.log(`✅ WhatsApp sent to ${phoneNumber}. MessageSid: ${response.data?.sid}`);

          // Add delay between messages to avoid rate limiting
          if (i < bulkData.phoneNumbers.length - 1) {
            await new Promise(resolve => setTimeout(resolve, delay * 1000));
          }

        } catch (error) {
          this.logger.error(`❌ Failed to send WhatsApp to ${phoneNumber}:`, error.message);
          errors.push({
            phoneNumber,
            success: false,
            error: error.response?.data || error.message,
          });
        }
      }

      const successCount = results.length;
      const errorCount = errors.length;

      return {
        success: successCount > 0,
        message: `Bulk WhatsApp completed. ${successCount} sent, ${errorCount} failed.`,
        data: {
          summary: {
            total: bulkData.phoneNumbers.length,
            successful: successCount,
            failed: errorCount,
          },
          results,
          errors,
        },
      };

    } catch (error) {
      return this.handleError(error, 'Failed to send bulk WhatsApp messages');
    }
  }

  // Email Methods (using SendGrid)
  async sendEmail(emailData: SendEmailDto): Promise<TwilioResponseDto> {
    try {
      this.logger.log(`Sending email from ${emailData.from} to ${emailData.to}`);

      if (!this.sendGridApiKey) {
        throw new BadRequestException('SendGrid API key not configured');
      }

      const payload = {
        personalizations: [
          {
            to: [{ email: emailData.to }],
            subject: emailData.subject,
          },
        ],
        from: { email: emailData.from },
        content: [
          {
            type: 'text/plain',
            value: emailData.text,
          },
          ...(emailData.html ? [{ type: 'text/html', value: emailData.html }] : []),
        ],
        ...(emailData.attachments && { attachments: emailData.attachments }),
      };

      console.log('🔍 DEBUG - SendGrid Email Request:');
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await firstValueFrom(
        this.httpService.post('https://api.sendgrid.com/v3/mail/send', payload, {
          headers: {
            'Authorization': `Bearer ${this.sendGridApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }),
      );

      this.logger.log('Email sent successfully via SendGrid');

      return {
        success: true,
        message: 'Email sent successfully',
        data: { status: response.status, headers: response.headers },
      };

    } catch (error) {
      return this.handleError(error, 'Failed to send email');
    }
  }

  // Utility Methods
  async getAccountInfo(): Promise<TwilioResponseDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}.json`, {
          auth: {
            username: this.accountSid,
            password: this.authToken,
          },
          timeout: 10000,
        }),
      );

      return {
        success: true,
        message: 'Account info retrieved successfully',
        data: response.data,
      };

    } catch (error) {
      return this.handleError(error, 'Failed to get account info');
    }
  }

  async getPhoneNumbers(): Promise<TwilioResponseDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/IncomingPhoneNumbers.json`, {
          auth: {
            username: this.accountSid,
            password: this.authToken,
          },
          timeout: 10000,
        }),
      );

      return {
        success: true,
        message: 'Phone numbers retrieved successfully',
        data: response.data,
      };

    } catch (error) {
      return this.handleError(error, 'Failed to get phone numbers');
    }
  }

  async getAvailableNumbers(countryCode: string = 'US'): Promise<TwilioResponseDto> {
    try {
      this.logger.log(`Fetching available numbers for country: ${countryCode}`);

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/AvailablePhoneNumbers/${countryCode}/Local.json`, {
          auth: {
            username: this.accountSid,
            password: this.authToken,
          },
          params: {
            PageSize: 10, // Limit to 10 for testing
          },
          timeout: 10000,
        }),
      );

      return {
        success: true,
        message: `Available numbers for ${countryCode} retrieved successfully`,
        data: response.data,
      };

    } catch (error) {
      return this.handleError(error, `Failed to get available numbers for ${countryCode}`);
    }
  }

  async getTrialInfo(): Promise<TwilioResponseDto> {
    try {
      this.logger.log('Fetching trial account information');

      // Get account info which includes trial status
      const accountResponse = await firstValueFrom(
        this.httpService.get(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}.json`, {
          auth: {
            username: this.accountSid,
            password: this.authToken,
          },
          timeout: 10000,
        }),
      );

      // Get balance info
      const balanceResponse = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/Balance.json`, {
          auth: {
            username: this.accountSid,
            password: this.authToken,
          },
          timeout: 10000,
        }),
      );

      const trialInfo = {
        account: accountResponse.data,
        balance: balanceResponse.data,
        isTrial: accountResponse.data.type === 'Trial',
        status: accountResponse.data.status,
        dateCreated: accountResponse.data.date_created,
      };

      return {
        success: true,
        message: 'Trial information retrieved successfully',
        data: trialInfo,
      };

    } catch (error) {
      return this.handleError(error, 'Failed to get trial information');
    }
  }

  private handleError(error: any, message: string): TwilioResponseDto {
    this.logger.error(`${message}: ${error.message}`, error.stack);

    console.log('❌ DEBUG - Twilio Error Details:');
    console.log('Error message:', error.message);
    console.log('Error response status:', error.response?.status);
    console.log('Error response data:', error.response?.data);

    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const errorData = error.response?.data;

      if (status === 400) {
        throw new BadRequestException({
          success: false,
          message: 'Invalid request parameters',
          error: errorData,
        });
      }

      if (status === 401) {
        throw new BadRequestException({
          success: false,
          message: 'Invalid Twilio credentials',
          error: errorData,
        });
      }

      if (status === 403) {
        throw new BadRequestException({
          success: false,
          message: 'Insufficient permissions or account suspended',
          error: errorData,
        });
      }

      if (status >= 500) {
        throw new InternalServerErrorException({
          success: false,
          message: 'Twilio service temporarily unavailable',
          error: errorData,
        });
      }
    }

    throw new InternalServerErrorException({
      success: false,
      message,
      error: error.message,
    });
  }
}