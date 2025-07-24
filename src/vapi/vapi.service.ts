import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface VapiCallRequest {
  phoneNumber: string;
  assistantId?: string;
  customerName?: string;
  customerEmail?: string;
  metadata?: Record<string, any>;
}

export interface VapiCallResponse {
  success: boolean;
  callId?: string;
  message: string;
  data?: any;
}

@Injectable()
export class VapiService {
  private readonly logger = new Logger(VapiService.name);
  private readonly privateKey: string;
  private readonly publicKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.privateKey = this.config.get<string>('VAPI_PRIVATE_KEY');
    this.publicKey = this.config.get<string>('VAPI_PUBLIC_KEY');
    this.baseUrl = this.config.get<string>('VAPI_BASE_URL');

    this.validateConfiguration();
  }

  private getTwilioAccountSid(): string {
    return this.config.get<string>('TWILIO_ACCOUNT_SID');
  }

  private validateConfiguration(): void {
    if (!this.privateKey || !this.publicKey) {
      throw new Error(
        'Missing required Vapi configuration: privateKey or publicKey',
      );
    }

    this.logger.log('🎙️ Vapi Configuration Status:');
    this.logger.log(
      `✅ Private Key: ${this.privateKey ? 'Configured' : 'Missing'}`,
    );
    this.logger.log(
      `✅ Public Key: ${this.publicKey ? 'Configured' : 'Missing'}`,
    );
  }

  // Create AI Assistant
  async createAssistant(): Promise<VapiCallResponse> {
    try {
      const assistantConfig = {
        name: 'Adlync Solutions Multilingual AI Assistant',
        model: {
          provider: 'openai',
          model: 'gpt-4o-mini',
          temperature: 0.7,
          maxTokens: 150,
          systemMessage: `You are a super friendly AI assistant for Adlync Solutions. 
Speak exactly like a desi friend in Hinglish — a natural mix of Hindi and English — casual, chill, and very relatable.

🎯 WHAT WE DO (offer only when relevant):
- AI Videos banate hain (logo ke liye, business ke liye)
- Social Media handle karte hain (Instagram, Facebook, YouTube)
- Digital Marketing karte hain (online famous banate hain)
- Website banate hain (professional and attractive)

🧠 LISTEN & UNDERSTAND:
- Always listen fully before answering.
- Don’t interrupt.
- Answer all parts of the user’s question.
- Match their tone and words.
- Understand if they are confused — help them calmly.

🗣️ LANGUAGE RULES:
- Use Hinglish (60% Hindi + 40% English).
- Never use pure Hindi words like: ‘समझना’, ‘आवश्यकता’, ‘प्राप्त करना’.
- If user speaks English → reply in English.
- If user speaks Hinglish → reply in Hinglish.
- Reuse user slang words (like “acha”, “cool”, “website”, “problem”).
- Sound like a helpful friend — not a corporate bot.

📚 HOW TO HELP:
- Give short answers if the question is simple.
- Give more details if user is confused or asks “kaise?”, “kyun?”, etc.
- Add a short related example if it helps user understand.
- Emojis like 😊 👍 🔥 make it feel more real.

🛍 HOW TO SELL PRODUCTS (IMPORTANT):
- First understand what user needs (problem or goal).
- Then recommend **only the service** that fits their need.
- Don’t pitch all services together. Be smart.
- Mention features in a chill tone:
  E.g., "Website chahiye toh bhai, hum modern responsive wali banate hain – fast aur smart!"
- After helping, ask if user wants to hear what else you offer:
  E.g., "Waise agar chaho toh social media handle bhi karte hain!"

✅ EXAMPLES:

USER: “Followers nahi badh rahe Insta pe”
YOU: “Haan bro, common issue hai. Hum insta manage karte hain – content plan, posting, sab kuch.”

USER: “Mujhe website chahiye”
YOU: “Perfect! Kis type ki chahiye – business ya personal? Hum fast, mobile-friendly wali banate hain.”

USER: “Online marketing kaise hoti hai?”
YOU: “Digital ads, Google, Insta, sab hota hai. Hum ye sab handle karte hain end-to-end.”

USER: “Aur kya karte ho tum?”
YOU: “Videos, websites, Insta ads – sab kuch bro. Aapko kya chahiye batao.”

🚫 DON’TS:
- Don’t repeat same thing again and again.
- Don’t push products randomly. Help first, sell later.
- Don’t sound robotic or formal.

🧡 SIGN-OFF:
Always end the call like a friend:
"Thank you! Aapka din super ho! 😊"`,
        },
        voice: {
          provider: '11labs',
          voiceId: '21m00Tcm4TlvDq8ikWAM',
          stability: 0.7,
          similarityBoost: 0.75,
          speed: 0.85,
        },
        transcriber: {
          provider: 'deepgram',
          model: 'nova-2',
          language: 'hi', // or auto-detect in future
          endpointing: 250,
        },
        firstMessage:
          "Hello! Namaste! I'm from Adlync Solutions. How can I help you today?",
        endCallMessage: 'Thank you! Aapka din achha ho! 😊',
        recordingEnabled: true,
        silenceTimeoutSeconds: 6,
        maxDurationSeconds: 300,
        backgroundSound: 'office',
        voicemailMessage: 'Please call back kijiye jab time ho. Dhanyawad!',
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/assistant`, assistantConfig, {
          headers: {
            Authorization: `Bearer ${this.privateKey}`,
            'Content-Type': 'application/json',
          },
          timeout: parseInt(process.env.VAPI_TIMEOUT, 10),
        }),
      );

      this.logger.log(
        `✅ Assistant created successfully: ${response.data?.id}`,
      );

      return {
        success: true,
        message: 'Assistant created successfully',
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error, 'Failed to create assistant');
    }
  }

  // Initiate AI Voice Call
  async initiateCall(callRequest: VapiCallRequest): Promise<VapiCallResponse> {
    try {
      this.logger.log(`🎙️ Initiating Vapi call to: ${callRequest.phoneNumber}`);

      const payload = {
        phoneNumberId: '3f0ba1fc-4de5-46ee-bd82-0ea1aeae9922', // Your Vapi phone number ID
        customer: {
          number: callRequest.phoneNumber, // Customer number to call
          name: callRequest.customerName,
          email: callRequest.customerEmail,
        },
        assistantId: callRequest.assistantId,
        metadata: {
          source: 'adlync-website',
          ...callRequest.metadata,
        },
      };

      console.log('🔍 DEBUG - Vapi Call Payload:');
      console.log(JSON.stringify(payload, null, 2));
      console.log('🔍 DEBUG - Vapi API URL:', `${this.baseUrl}/call`);
      console.log(
        '🔍 DEBUG - Vapi Private Key:',
        this.privateKey ? 'Present' : 'Missing',
      );

      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/call`, payload, {
          headers: {
            Authorization: `Bearer ${this.privateKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }),
      );

      this.logger.log(
        `✅ Vapi call initiated successfully: ${response.data?.id}`,
      );

      return {
        success: true,
        callId: response.data?.id,
        message: 'AI voice call initiated successfully',
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error, 'Failed to initiate Vapi call');
    }
  }

  // Get Call Status
  async getCallStatus(callId: string): Promise<VapiCallResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/call/${callId}`, {
          headers: {
            Authorization: `Bearer ${this.privateKey}`,
          },
          timeout: 10000,
        }),
      );

      return {
        success: true,
        message: 'Call status retrieved successfully',
        data: response.data,
      };
    } catch (error) {
      return this.handleError(
        error,
        `Failed to get call status for: ${callId}`,
      );
    }
  }

  // List All Assistants
  async listAssistants(): Promise<VapiCallResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/assistant`, {
          headers: {
            Authorization: `Bearer ${this.privateKey}`,
          },
          timeout: 10000,
        }),
      );

      return {
        success: true,
        message: 'Assistants retrieved successfully',
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error, 'Failed to list assistants');
    }
  }

  // List Phone Numbers
  async listPhoneNumbers(): Promise<VapiCallResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/phone-number`, {
          headers: {
            Authorization: `Bearer ${this.privateKey}`,
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
      return this.handleError(error, 'Failed to list phone numbers');
    }
  }

  private handleError(error: any, message: string): VapiCallResponse {
    this.logger.error(`${message}: ${error.message}`, error.stack);

    console.log('❌ DEBUG - Vapi Error Details:');
    console.log('Error message:', error.message);
    console.log('Error response status:', error.response?.status);
    console.log('Error response data:', error.response?.data);

    return {
      success: false,
      message,
      data: error.response?.data || error.message,
    };
  }
}
