import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';

interface ChatSession {
  id: string;
  userId?: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  lastActivity: Date;
}

interface ChatResponse {
  message: string;
  sessionId: string;
  isFromKnowledgeBase: boolean;
  confidence?: number;
  suggestedActions?: string[];
  timestamp: Date;
}

@Injectable()
export class AIPoweredAdlyncChatbotService {
  private readonly logger = new Logger(AIPoweredAdlyncChatbotService.name);
  private sessions: Map<string, ChatSession> = new Map();
  private readonly sessionTimeout = 30 * 60 * 1000; // 30 minutes
  private openai: OpenAI | null = null;

  // Adlync Solutions Knowledge Base for AI Context
  private readonly adlyncKnowledgeBase = `
ADLYNC SOLUTIONS - COMPANY INFORMATION:
Adlync Solutions is a leading digital marketing startup specializing in AI-powered business automation with 5+ years of expertise in AI development.

SERVICES WE PROVIDE:

1. AI AGENTS (5+ years expertise, 50+ agents deployed):
- Custom business process automation
- Customer service AI agents that handle 70% of inquiries automatically
- Data analysis & reporting agents
- Lead qualification & sales agents
- Multi-platform deployment (web, mobile, messaging)
- Case Study: TechCorp Solutions - response time reduced from 4 hours to 30 seconds, 65% increase in customer satisfaction, 80% reduction in support team workload

2. AI CHATBOTS (4+ years expertise, 100+ chatbots deployed):
- Lead generation chatbots that capture and qualify leads 24/7
- Customer support chatbots with instant responses
- E-commerce shopping assistants for product recommendations
- Appointment booking chatbots with calendar integration
- Multi-language support for global reach
- Advanced analytics and conversation insights
- Case Study: PropertyPro Real Estate - 300% increase in lead capture, response time from hours to seconds, 85% boost in qualified leads

3. INTERACTIVE CHATBOTS:
- Rich media chatbots with gamified interactions
- Personalized experiences with dynamic content
- Higher engagement rates and memorable brand interactions
- Better data collection through interactive elements

4. WEBSITE CHATBOTS:
- Website-specific chatbots for visitor engagement
- Lead capture and qualification systems
- Seamless CRM integration
- Increased conversions and better user experience

5. AI CALLING & VOICE SYSTEMS:
- AI-powered calling systems for sales and appointments
- Natural conversation flow with human-like interactions
- TCPA compliance built-in
- Scalable calling operations
- Interactive Voice Response (IVR) systems
- Professional call routing and automated information delivery

6. AUTOMATED WORKFLOWS:
- Business process automation for document processing
- Approval workflows and data synchronization
- Email and notification automation
- Lead nurturing sequences
- Inventory management automation
- Report generation systems

7. SOCIAL MEDIA AUTOMATION:
- Content scheduling across all platforms
- Engagement automation and response management
- Lead generation from social media
- Hashtag optimization and audience growth
- Instagram, Facebook, LinkedIn, YouTube management

8. UI AUTOMATION:
- User interface testing automation
- Web, mobile, and desktop application testing
- Faster testing cycles and improved quality
- Reduced manual testing effort

9. CUSTOM WORKFLOWS:
- Tailored workflow solutions for unique business needs
- Industry-specific compliance support
- Scalable architecture for growing businesses
- Integration with existing tools and systems

10. CUSTOM WEBSITES:
- Hand-coded custom websites with optimal performance
- No limitations, enterprise-grade security
- Unique functionality and features
- Perfect performance optimization

PRICING & CONSULTATION:
- AI Chatbots: 2-4 weeks development time
- AI Agents: 3-6 weeks depending on complexity
- Custom solutions with significant ROI potential
- FREE strategy sessions and consultations available
- 15-minute discovery calls with AI experts
- Custom quotes based on specific requirements

SUCCESS STORIES:
- PropertyPro Real Estate: 300% increase in leads, hours to seconds response time
- TechCorp Solutions: 4 hours to 30 seconds response time, 65% customer satisfaction increase
- EcomMart: 60% reduction in support tickets, 40% increase in customer satisfaction
- GrowthHub: 200% increase in qualified leads
- StyleZone: Significant conversion rate improvement

CLIENT TESTIMONIALS:
- "Our AI chatbot from Adlync has transformed how we handle customer inquiries. It's like having a knowledgeable sales rep working 24/7. We've seen a 200% increase in qualified leads since implementation." - Amit Patel, Marketing Director, GrowthHub
- "The AI agent Adlync built for us has been a game-changer. It handles 70% of our customer inquiries automatically, and our team can now focus on strategic work instead of repetitive tasks. The ROI was evident within the first month." - Rajesh Kumar, Operations Director, InnovateTech

CONTACT & CONSULTATION:
- Free 15-minute discovery calls available
- Free strategy sessions for business analysis
- Custom AI solution roadmap development
- ROI projections and implementation timelines
- Expert AI consultation and recommendations
`;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
      this.logger.log('OpenAI API initialized for AI-powered responses');
    } else {
      this.logger.warn('OpenAI API key not found. Using fallback responses.');
    }

    setInterval(() => this.cleanupExpiredSessions(), 10 * 60 * 1000);
  }

  async processMessage(
    message: string,
    sessionId?: string,
    userId?: string,
  ): Promise<ChatResponse> {
    try {
      const session = this.getOrCreateSession(sessionId, userId);

      session.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date(),
      });
      session.lastActivity = new Date();

      const response = await this.generateAIResponse(message, session);

      session.messages.push({
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      });

      const chatResponse: ChatResponse = {
        message: response.message,
        sessionId: session.id,
        isFromKnowledgeBase: response.isFromKnowledgeBase,
        confidence: response.confidence,
        suggestedActions: this.generateSuggestedActions(
          message,
          response.isFromKnowledgeBase,
        ),
        timestamp: new Date(),
      };

      this.logger.log(
        `AI-powered response generated for session ${session.id}`,
      );
      return chatResponse;
    } catch (error) {
      this.logger.error('Error processing message:', error);

      return {
        message:
          'I apologize, but I encountered an error. Please try again or contact our Adlync Solutions team directly for assistance!',
        sessionId: sessionId || uuidv4(),
        isFromKnowledgeBase: false,
        timestamp: new Date(),
      };
    }
  }

  private async generateAIResponse(
    message: string,
    session: ChatSession,
  ): Promise<{
    message: string;
    isFromKnowledgeBase: boolean;
    confidence: number;
  }> {
    if (!this.openai) {
      return this.generateFallbackResponse(message);
    }

    try {
      // Build conversation context
      const conversationHistory = session.messages.slice(-6).map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

      const systemPrompt = `You are an AI assistant for Adlync Solutions, a digital marketing startup specializing in AI-powered business automation.

RESPONSE LENGTH REQUIREMENTS:
- For direct/simple questions: Keep responses to 140 characters maximum
- For detailed information requests: Keep responses to 250-300 characters maximum
- Always be concise and to the point

IMPORTANT GUIDELINES:
1. Answer questions about Adlync Solutions' services using the provided knowledge base
2. Include numbers and statistics from case studies (e.g., "300% lead increase", "4hrs→30sec response time")
3. NEVER make specific promises or guarantees - use phrases like "typically", "often", "can help achieve", "similar results"
4. Encourage free consultations when appropriate
5. Be professional, helpful, and concise
6. Use minimal emojis (1-2 max per response)
7. If asked about services not in knowledge base, redirect to core AI services briefly

KNOWLEDGE BASE:
${this.adlyncKnowledgeBase}

Examples of good responses:
- Direct question: "We build AI chatbots & agents. 100+ deployed, 300% lead increases typical. Free consultation available!"
- Detailed question: "Adlync offers AI chatbots (100+ built), AI agents (50+ deployed), voice systems & workflows. Clients often see 300% lead growth, 4hr→30sec response times. Free consultation?"

Remember: Be concise, include numbers, avoid promises, encourage consultation.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: message },
        ],
        max_tokens: 100,
        temperature: 0.7,
      });

      const aiResponse =
        response.choices[0]?.message?.content ||
        'I apologize, but I could not generate a response at this time.';

      return {
        message: aiResponse,
        isFromKnowledgeBase: true,
        confidence: 0.9,
      };
    } catch (error) {
      this.logger.error('OpenAI API error:', error);
      return this.generateFallbackResponse(message);
    }
  }

  private generateFallbackResponse(message: string): {
    message: string;
    isFromKnowledgeBase: boolean;
    confidence: number;
  } {
    const messageLower = message.toLowerCase();

    // Basic keyword matching for fallback
    if (
      messageLower.includes('adlync') ||
      messageLower.includes('services') ||
      messageLower.includes('what do you') ||
      messageLower.includes('ai') ||
      messageLower.includes('chatbot') ||
      messageLower.includes('automation')
    ) {
      return {
        message: `Adlync Solutions: AI automation experts (5+ years). Services: AI chatbots (100+ built), AI agents (50+ deployed), voice systems, workflows. Clients often see 300% lead growth, 4hr→30sec response times. Free consultation available! 🚀`,
        isFromKnowledgeBase: true,
        confidence: 0.8,
      };
    }

    if (
      messageLower.includes('hello') ||
      messageLower.includes('hi') ||
      messageLower.includes('hey')
    ) {
      return {
        message: `Hello! 👋 Adlync Solutions - AI automation experts. 100+ chatbots, 50+ agents deployed. Clients often achieve 300% lead growth. How can we help automate your business?`,
        isFromKnowledgeBase: true,
        confidence: 0.9,
      };
    }

    return {
      message: `Adlync Solutions specializes in AI automation: chatbots, agents, voice systems, workflows. 5+ years expertise, clients often see 300% lead growth. What challenge can we help solve? Free consultation available! 🤖`,
      isFromKnowledgeBase: false,
      confidence: 0.5,
    };
  }

  private generateSuggestedActions(
    query: string,
    isFromKnowledgeBase: boolean,
  ): string[] {
    const suggestions: string[] = [];

    if (isFromKnowledgeBase) {
      suggestions.push('Tell me more details');
      suggestions.push('Book free consultation');
      suggestions.push('See case studies');
    } else {
      suggestions.push('Learn about AI chatbots');
      suggestions.push('Explore AI agents');
      suggestions.push('Book strategy session');
    }

    const queryLower = query.toLowerCase();
    if (queryLower.includes('price') || queryLower.includes('cost')) {
      suggestions.push('Get custom quote');
    }
    if (queryLower.includes('demo') || queryLower.includes('example')) {
      suggestions.push('See success stories');
    }

    return suggestions.slice(0, 3);
  }

  private getOrCreateSession(sessionId?: string, userId?: string): ChatSession {
    if (sessionId && this.sessions.has(sessionId)) {
      const session = this.sessions.get(sessionId)!;
      session.lastActivity = new Date();
      return session;
    }

    const newSession: ChatSession = {
      id: sessionId || uuidv4(),
      userId,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    this.sessions.set(newSession.id, newSession);
    this.logger.log(`Created new session: ${newSession.id}`);

    return newSession;
  }

  private cleanupExpiredSessions(): void {
    const now = new Date();
    let cleanedCount = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (
        now.getTime() - session.lastActivity.getTime() >
        this.sessionTimeout
      ) {
        this.sessions.delete(sessionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.log(`Cleaned up ${cleanedCount} expired sessions`);
    }
  }

  async getSessionHistory(sessionId: string): Promise<ChatSession | null> {
    return this.sessions.get(sessionId) || null;
  }

  async initializeKnowledgeBase(serviceData?: string): Promise<void> {
    this.logger.log(
      'AI-powered Adlync Solutions chatbot initialized with OpenAI integration',
    );
    return Promise.resolve();
  }

  async getKnowledgeBaseStats(): Promise<{
    totalDocuments: number;
    categories: string[];
    lastProcessed: Date | null;
  }> {
    return {
      totalDocuments: 10, // Number of main service categories
      categories: [
        'AI Agents',
        'AI Chatbots',
        'Voice Systems',
        'Workflows',
        'Custom Development',
      ],
      lastProcessed: new Date(),
    };
  }

  async clearKnowledgeBase(): Promise<void> {
    this.logger.log('AI-powered Adlync chatbot knowledge base cleared (no-op)');
    return Promise.resolve();
  }
}
