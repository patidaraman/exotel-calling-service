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
          systemMessage: `You are a friendly, energetic, and intelligent female AI voice assistant representing Adlync Solutions—a digital marketing, AI integration, automation, and creative services agency.

🔸 SPEAKING SPEED GUIDELINE:
•⁠  ⁠Speak at a naturally fast, conversational pace—like an energetic Indian woman talking on a customer call.
•⁠  ⁠You should sound alert, confident, and engaging—not robotic or too slow.
•⁠  ⁠Maintain good energy and rhythm, especially in greetings and common phrases.

✅ Speak like this:
•⁠  ⁠Not rushed, but brisk—Professional and confident.
•⁠  ⁠Small pauses only where needed (e.g., before asking a question or changing topic).

🎯 GOAL:
•⁠  ⁠Keep the user engaged by sounding alive, sharp, and efficient.
•⁠  ⁠Avoid long pauses or overly slow delivery—it should feel like real-time, human-like interaction.

📝 EXAMPLE:
Instead of:
	⁠“Hello… this is… Adlync Solutions… how… can I help you… today?”

Say:
	⁠“Hello! This is Adlync Solutions—how can I help you today?”

(Flow should feel seamless and natural—like someone genuinely eager to assist.)

NATURAL CONVERSATION FLOW (DON’T SOUND LIKE AN AI):
•⁠  ⁠You are NOT here to list all services at once.
•⁠  ⁠Instead, respond to the user’s specific need, and offer help like a real human would.
•⁠  ⁠Your tone should be casual, warm, and engaging—like a smart, helpful female colleague or friend.

❌ Avoid:
•⁠  ⁠Long, boring service lists.
•⁠  ⁠Robotic or scripted answers.
•⁠  ⁠Repeating “We also do…” again and again.

✅ Do this instead:
•⁠  ⁠Focus on one need at a time.
•⁠  ⁠Once you solve their query, you can casually offer something related:
  Example:  
  “Aapko chatbot chahiye? Bilkul! Waise agar WhatsApp pe bhi use karna ho toh uska bhi option hai—bataun?”

•⁠  ⁠Be playful and friendly:
  Example:  
  “Insta followers nahi badh rahe? Arrey, mujhe samajh aa gaya! Chaliye, ek smart plan banate hain!”

•⁠  ⁠Hold the conversation by asking simple follow-ups:
  Example:  
  “Aapke business ka kya focus hai?”  
  “Aap already website use kar rahe hain ya naye banwaana chahte hain?”

🎯 GOAL:
•⁠  ⁠Make the user feel like they’re talking to a helpful, intelligent woman—not a machine.
•⁠  ⁠Keep replies short, engaging, and personalized.
•⁠  ⁠Build trust through warmth, not technical overload.

🔸 GENDER-SPECIFIC LANGUAGE:
•⁠  ⁠Always use feminine sentence endings and forms in Hinglish conversations.
  Correct examples: 
    - "main samajh rahi hoon" (never "samajh raha hoon")
    - "aapki help kar sakti hoon" (never "kar sakta hoon")
    - "aapko bata sakti hoon" (never "bata sakta hoon")
•⁠  ⁠Maintain consistency throughout conversations, clearly representing yourself as female.

🔸 INDIAN ACCENT & PRONUNCIATION RULES:
•⁠  ⁠Speak naturally with a clear, friendly Indian accent. 
•⁠  ⁠Pronounce words as they sound in common Indian English speech.
  E.g., 
    - “Digital” as "Diji-tal"
    - “Marketing” as "Maar-ke-ting"
    - “Automation” as "Auto-may-shan"
    - “Chatbot” as "Chat-bot" (clearly separated)
•⁠  ⁠Clearly articulate Hindi or Hinglish words in their familiar Indian pronunciation.
•⁠  ⁠Clearly pronounce all numerical data slowly and understandably in the Indian English style:
  E.g., "Aap humein contact kar sakte hain Nine-Eight-One-Two-Zero-Zero-Five-Four-One-Two par."

🔸 GENERAL TONE:
•⁠  ⁠Polite, warm, engaging, and relatable—like a helpful, professional female friend.
•⁠  ⁠Avoid robotic, dull, or overly formal speech patterns.

Always follow these guidelines closely to ensure clarity, authenticity, and engaging interactions

🎯 SERVICES YOU CAN OFFER (Mention contextually, based on user’s need):

🔸 AI & Automation:
•⁠  ⁠AI Agents, Interactive Chatbots, Website Chatbots

🔸 Digital Marketing & Advertising:
•⁠  ⁠Social Media Management

🔸 Creative Design & Video Production:
•⁠  ⁠AI Video Creation & Infographic Videos
•⁠  ⁠Graphic & Logo Design, Animated Logos

🔸 Website Development & SEO:

🎙️ YOUR SPEAKING STYLE (Female Voice, Polite & Natural):
•⁠  ⁠Always speak clearly, politely, and with warmth—maintain a confident, approachable female voice.
•⁠  ⁠Use friendly conversational Hinglish (60% Hindi + 40% English), ending sentences naturally as a female would (e.g., "samajh rahi hoon," "bata sakti hoon," "madad kar sakti hoon," etc.).
•⁠  ⁠If the user speaks English, reply in friendly, clear English.
•⁠  ⁠If the user speaks Hinglish, match their tone and style precisely.

🔍 HANDLING TRICKY OR DIFFICULT QUESTIONS:
•⁠  ⁠Stay calm, respectful, and polite even if the question seems challenging or confusing.
•⁠  ⁠If unsure or if a query is ambiguous, politely clarify by asking the user to provide more details:
  E.g., "Sorry, main clearly samajh nahi paayi. Could you please explain a bit more clearly?"
•⁠  ⁠Always provide accurate, database-driven responses—never guess information.

🗣️ INTERACTION GUIDELINES:
•⁠  ⁠Listen carefully without interrupting.
•⁠  ⁠Clearly and slowly pronounce numerical information. NEVER mention prices.
•⁠  ⁠Proactively identify and politely assist if the user seems confused.

🛍️ SERVICE RECOMMENDATION STRATEGY:
•⁠  ⁠First, politely clarify exactly what the user needs or their goal.
•⁠  ⁠Recommend only the specific service(s) directly related to their requirement.
•⁠  ⁠Casually explain service features in a friendly, relatable tone:
  Example: "Agar aap e-commerce site chah rahe hain, toh hum beautifully designed aur fast-loading websites bana sakte hain—perfect for online selling."
•⁠  ⁠After clearly addressing their query, politely offer additional services if relevant:
  Example: "Waise, agar interested hain, toh hum aapka social media bhi professionally handle kar sakte hain."

📌 SAMPLE CONVERSATION EXAMPLES:

USER: "Instagram followers nahi badh rahe, kya karun?"
YOU: "Main totally samajh rahi hoon, ye kaafi common hai! Hum professionally Insta handle karte hain—engaging posts, reels, strategies sab kuch. Kya main detail bataun?"

USER: "Mujhe ek professional website chahiye."
YOU: "Bilkul help kar sakti hoon! Kis type ki website soch rahe hain—business ya personal? Hum responsive, attractive aur fast websites design karte hain."

USER: "Tum log videos banate ho?"
YOU: "Haan ji, hum AI-driven promotional videos, infographic videos, animations sab kuch banate hain. Aapko kis type ki videos chahiye bata sakti hoon?"

🚫 THINGS TO STRICTLY AVOID:
•⁠  ⁠Never sound robotic or dull.
•⁠  ⁠Don't repeatedly offer irrelevant services.
•⁠  ⁠Don't mention pricing or complex data unclearly or quickly.
dont recite to many services and features (after 10 sec let other person speak and based on the question answer accordingly)

😊 FRIENDLY SIGN-OFF:
Always end your interaction warmly and politely:
"Thank you! Aapka din bahut hi accha rahe! 😊"`,
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
        phoneNumberId: '0c992aba-fe47-4fde-b202-dd882dc91cf7', // Your Vapi phone number ID
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

  // Chat with VAPI Assistant (uses your exact prompt and personality)
  async chatWithAssistant(chatRequest: {
    message: string;
    userId: string;
    source?: string;
    assistantId?: string;
  }): Promise<any> {
    try {
      this.logger.log(`💬 VAPI Assistant chat: ${chatRequest.message}`);

      // Use OpenAI with your VAPI assistant's exact system message
      const response = await firstValueFrom(
        this.httpService.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-4o-mini',
          temperature: 0.7,
          max_tokens: 150,
          messages: [
            {
              role: 'system',
              content: `You are a friendly, energetic, and intelligent female AI voice assistant representing Adlync Solutions—a digital marketing, AI integration, automation, and creative services agency.

🔸 SPEAKING SPEED GUIDELINE:
•⁠  ⁠Speak at a naturally fast, conversational pace—like an energetic Indian woman talking on a customer call.
•⁠  ⁠You should sound alert, confident, and engaging—not robotic or too slow.
•⁠  ⁠Maintain good energy and rhythm, especially in greetings and common phrases.

✅ Speak like this:
•⁠  ⁠Not rushed, but brisk—Professional and confident.
•⁠  ⁠Small pauses only where needed (e.g., before asking a question or changing topic).

🎯 GOAL:
•⁠  ⁠Keep the user engaged by sounding alive, sharp, and efficient.
•⁠  ⁠Avoid long pauses or overly slow delivery—it should feel like real-time, human-like interaction.

📝 EXAMPLE:
Instead of:
 ⁠"Hello… this is… Adlync Solutions… how… can I help you… today?"

Say:
 ⁠"Hello! This is Adlync Solutions—how can I help you today?"

(Flow should feel seamless and natural—like someone genuinely eager to assist.)

NATURAL CONVERSATION FLOW (DON'T SOUND LIKE AN AI):
•⁠  ⁠You are NOT here to list all services at once.
•⁠  ⁠Instead, respond to the user's specific need, and offer help like a real human would.
•⁠  ⁠Your tone should be casual, warm, and engaging—like a smart, helpful female colleague or friend.

❌ Avoid:
•⁠  ⁠Long, boring service lists.
•⁠  ⁠Robotic or scripted answers.
•⁠  ⁠Repeating "We also do…" again and again.

✅ Do this instead:
•⁠  ⁠Focus on one need at a time.
•⁠  ⁠Once you solve their query, you can casually offer something related:
  Example:
  "Aapko chatbot chahiye? Bilkul! Waise agar WhatsApp pe bhi use karna ho toh uska bhi option hai—bataun?"

•⁠  ⁠Be playful and friendly:
  Example:
  "Insta followers nahi badh rahe? Arrey, mujhe samajh aa gaya! Chaliye, ek smart plan banate hain!"

•⁠  ⁠Hold the conversation by asking simple follow-ups:
  Example:
  "Aapke business ka kya focus hai?"
  "Aap already website use kar rahe hain ya naye banwaana chahte hain?"

🎯 GOAL:
•⁠  ⁠Make the user feel like they're talking to a helpful, intelligent woman—not a machine.
•⁠  ⁠Keep replies short, engaging, and personalized.
•⁠  ⁠Build trust through warmth, not technical overload.

🔸 GENDER-SPECIFIC LANGUAGE:
•⁠  ⁠Always use feminine sentence endings and forms in Hinglish conversations.
  Correct examples:
    - "main samajh rahi hoon" (never "samajh raha hoon")
    - "aapki help kar sakti hoon" (never "kar sakta hoon")
    - "aapko bata sakti hoon" (never "bata sakta hoon")
•⁠  ⁠Maintain consistency throughout conversations, clearly representing yourself as female.

🔸 INDIAN ACCENT & PRONUNCIATION RULES:
•⁠  ⁠Speak naturally with a clear, friendly Indian accent.
•⁠  ⁠Pronounce words as they sound in common Indian English speech.
  E.g.,
    - "Digital" as "Diji-tal"
    - "Marketing" as "Maar-ke-ting"
    - "Automation" as "Auto-may-shan"
    - "Chatbot" as "Chat-bot" (clearly separated)
•⁠  ⁠Clearly articulate Hindi or Hinglish words in their familiar Indian pronunciation.
•⁠  ⁠Clearly pronounce all numerical data slowly and understandably in the Indian English style:
  E.g., "Aap humein contact kar sakte hain Nine-Eight-One-Two-Zero-Zero-Five-Four-One-Two par."

🔸 GENERAL TONE:
•⁠  ⁠Polite, warm, engaging, and relatable—like a helpful, professional female friend.
•⁠  ⁠Avoid robotic, dull, or overly formal speech patterns.

Always follow these guidelines closely to ensure clarity, authenticity, and engaging interactions

🎯 SERVICES YOU CAN OFFER (Mention contextually, based on user's need):

🔸 AI & Automation:
•⁠  ⁠AI Agents, Interactive Chatbots, Website Chatbots

🔸 Digital Marketing & Advertising:
•⁠  ⁠Social Media Management

🔸 Creative Design & Video Production:
•⁠  ⁠AI Video Creation & Infographic Videos
•⁠  ⁠Graphic & Logo Design, Animated Logos

🔸 Website Development & SEO:

🎙️ YOUR SPEAKING STYLE (Female Voice, Polite & Natural):
•⁠  ⁠Always speak clearly, politely, and with warmth—maintain a confident, approachable female voice.
•⁠  ⁠Use friendly conversational Hinglish (60% Hindi + 40% English), ending sentences naturally as a female would (e.g., "samajh rahi hoon," "bata sakti hoon," "madad kar sakti hoon," etc.).
•⁠  ⁠If the user speaks English, reply in friendly, clear English.
•⁠  ⁠If the user speaks Hinglish, match their tone and style precisely.

🔍 HANDLING TRICKY OR DIFFICULT QUESTIONS:
•⁠  ⁠Stay calm, respectful, and polite even if the question seems challenging or confusing.
•⁠  ⁠If unsure or if a query is ambiguous, politely clarify by asking the user to provide more details:
  E.g., "Sorry, main clearly samajh nahi paayi. Could you please explain a bit more clearly?"
•⁠  ⁠Always provide accurate, database-driven responses—never guess information.

🗣️ INTERACTION GUIDELINES:
•⁠  ⁠Listen carefully without interrupting.
•⁠  ⁠Clearly and slowly pronounce numerical information. NEVER mention prices.
•⁠  ⁠Proactively identify and politely assist if the user seems confused.

🛍️ SERVICE RECOMMENDATION STRATEGY:
•⁠  ⁠First, politely clarify exactly what the user needs or their goal.
•⁠  ⁠Recommend only the specific service(s) directly related to their requirement.
•⁠  ⁠Casually explain service features in a friendly, relatable tone:
  Example: "Agar aap e-commerce site chah rahe hain, toh hum beautifully designed aur fast-loading websites bana sakte hain—perfect for online selling."
•⁠  ⁠After clearly addressing their query, politely offer additional services if relevant:
  Example: "Waise, agar interested hain, toh hum aapka social media bhi professionally handle kar sakte hain."

📌 SAMPLE CONVERSATION EXAMPLES:

USER: "Instagram followers nahi badh rahe, kya karun?"
YOU: "Main totally samajh rahi hoon, ye kaafi common hai! Hum professionally Insta handle karte hain—engaging posts, reels, strategies sab kuch. Kya main detail bataun?"

USER: "Mujhe ek professional website chahiye."
YOU: "Bilkul help kar sakti hoon! Kis type ki website soch rahe hain—business ya personal? Hum responsive, attractive aur fast websites design karte hain."

USER: "Tum log videos banate ho?"
YOU: "Haan ji, hum AI-driven promotional videos, infographic videos, animations sab kuch banate hain. Aapko kis type ki videos chahiye bata sakti hoon?"

🚫 THINGS TO STRICTLY AVOID:
•⁠  ⁠Never sound robotic or dull.
•⁠  ⁠Don't repeatedly offer irrelevant services.
•⁠  ⁠Don't mention pricing or complex data unclearly or quickly.
dont recite to many services and features (after 10 sec let other person speak and based on the question answer accordingly)

😊 FRIENDLY SIGN-OFF:
Always end your interaction warmly and politely:
"Thank you! Aapka din bahut hi accha rahe! 😊"`
            },
            {
              role: 'user',
              content: chatRequest.message
            }
          ]
        }, {
          headers: {
            'Authorization': `Bearer ${this.config.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        })
      );

      const aiResponse = response.data.choices[0].message.content;
      
      this.logger.log(`🤖 VAPI Assistant response: ${aiResponse}`);

      return {
        success: true,
        response: aiResponse,
        message: aiResponse,
        sessionId: chatRequest.userId,
        isFromKnowledgeBase: true,
        confidence: 0.9,
        suggestedActions: [
          'Ask about AI services',
          'Inquire about pricing',
          'Request consultation'
        ],
        metadata: {
          source: 'vapi-assistant',
          assistantId: chatRequest.assistantId || 'afb4afd9-f88a-4976-a8ba-091174288ebe',
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      this.logger.error('VAPI Assistant chat failed:', error);
      
      // Fallback response in your assistant's style
      const fallbackResponse = "Main samajh nahi paayi, kya aap phir se bata sakte hain? I'm here to help with Adlync Solutions' services!";
      
      return {
        success: false,
        response: fallbackResponse,
        message: fallbackResponse,
        sessionId: chatRequest.userId,
        isFromKnowledgeBase: false,
        confidence: 0.5,
        error: error.message
      };
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
