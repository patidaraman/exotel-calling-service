const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../../dist/app.module');

let app;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.init();
  }
  return app;
}

// Mock config service for services that need it
const createMockConfigService = () => ({
  get: (key, defaultValue) => process.env[key] || defaultValue
});

// Comprehensive chatbot response generator (from Twilio controller)
function generateChatbotResponse(message, from) {
  const phoneNumber = from.replace('whatsapp:', '');

  // Website Visitor Welcome Message
  if (
    message.includes('visited your website') ||
    message.includes('digital marketing services') ||
    message.includes('please share details') ||
    message.includes('would like to know more') ||
    message.includes('hello! i visited')
  ) {
    return `🚀 *Welcome to Adlync Solutions!*

Thank you for visiting our website! I'm your AI assistant ready to help.

*Our Digital Marketing Services:*

🎬 *AI Videos & Content Creation*
• AI Avatar Spokesperson Videos
• Product Demo Videos
• Social Media Content
• Starting from ₹5,000

📱 *Social Media Marketing*
• Instagram & Facebook Management
• Content Creation & Design
• Paid Advertising Campaigns
• Packages from ₹15,000/month

🎯 *Complete Digital Solutions*
• SEO & Google Ads
• Website Development
• Lead Generation Systems
• Custom packages from ₹25,000/month

*Quick Actions:*
• Type *"pricing"* for detailed pricing
• Type *"portfolio"* to see our work
• Type *"consultation"* for free strategy session
• Type *"services"* for complete service list

*For complete interactive menu with all options, just type* *"hi"*

*What specific service interests you most?*

Our team will respond within 5 minutes! 💬`;
  }

  // Main Menu Keywords
  if (
    !message ||
    message === 'hi' ||
    message === 'hii' ||
    message === 'hello' ||
    message === 'hey' ||
    message === 'start' ||
    message === 'menu' ||
    message.includes('hi')
  ) {
    return `Welcome to Adlync Solutions AI Assistant!

Hi there! I am here to help you with our digital marketing services.

Please choose an option:

1 - AI Videos and Avatar Videos
2 - Social Media Marketing
3 - Digital Marketing Solutions
4 - Our Portfolio and Case Studies
5 - Pricing and Packages
6 - Book Free Consultation
7 - Contact Information
8 - About Adlync Solutions

Just type the number (1-8) or keyword!

Type "menu" anytime to see options again.`;
  }

  // Option 1: AI Videos
  if (
    message === '1' ||
    message.includes('ai video') ||
    message.includes('avatar')
  ) {
    return `🎬 *AI Videos & Avatar Videos*

We create stunning AI-powered videos:

✨ *Our AI Video Services:*
• AI Avatar Spokesperson Videos
• AI-Generated Product Demos
• Personalized Video Messages
• Animated Explainer Videos
• AI Voice-over & Dubbing

🎯 *Benefits:*
• Cost-effective than traditional videos
• Quick turnaround (24-48 hours)
• Multiple languages support
• Unlimited revisions
• Professional quality

💰 *Starting from ₹5,000 per video*

*Want to see samples?* Type *"samples"*
*Ready to order?* Type *"order"*
*Back to menu?* Type *"menu"*`;
  }

  // Option 2: Social Media Marketing
  if (
    message === '2' ||
    message.includes('social media') ||
    message.includes('marketing')
  ) {
    return `📱 *Social Media Marketing*

Grow your business with our expert social media strategies:

🚀 *Our Services:*
• Instagram & Facebook Management
• Content Creation & Design
• Paid Advertising Campaigns
• Influencer Marketing
• Analytics & Reporting
• Community Management

📊 *What You Get:*
• 30 posts per month
• Daily story updates
• Targeted ad campaigns
• Monthly performance reports
• 24/7 support

💰 *Packages starting from ₹15,000/month*

*Want custom package?* Type *"custom"*
*See our work?* Type *"portfolio"*
*Back to menu?* Type *"menu"*`;
  }

  // Option 5: Pricing
  if (
    message === '5' ||
    message.includes('pricing') ||
    message.includes('cost') ||
    message.includes('price')
  ) {
    return `💰 *Pricing & Packages*

Transparent pricing for all budgets:

🎬 *AI Video Packages:*
• Basic: ₹5,000 (30-sec video)
• Standard: ₹10,000 (60-sec + revisions)
• Premium: ₹20,000 (Multiple videos)

📱 *Social Media Packages:*
• Starter: ₹15,000/month
• Growth: ₹25,000/month
• Enterprise: ₹50,000/month

🚀 *Digital Marketing:*
• SEO Package: ₹20,000/month
• Complete Solution: ₹40,000/month
• Custom Enterprise: ₹1,00,000+/month

🎁 *Special Offers:*
• 20% off first month
• Free consultation worth ₹5,000
• No setup fees

*Custom quote?* Type *"quote"*
*Ready to start?* Type *"order"*
*Back to menu?* Type *"menu"*`;
  }

  // Option 6: Book Consultation
  if (
    message === '6' ||
    message.includes('consultation') ||
    message.includes('book') ||
    message === 'quote'
  ) {
    return `📅 *Book Your FREE Consultation*

Get expert advice tailored to your business:

🎯 *What You'll Get:*
• 30-minute strategy session
• Business analysis & audit
• Custom marketing plan
• ROI projections
• No-obligation proposal

📞 *Book Now:*
• Call: +91-XXXX-XXXX-XXX
• Email: consultation@adlyncsolutions.com
• WhatsApp: Just reply "BOOK NOW"

⏰ *Available Slots:*
• Monday-Friday: 10 AM - 6 PM
• Saturday: 10 AM - 2 PM
• Emergency: 24/7 support

*Book immediately?* Type *"BOOK NOW"*
*Questions first?* Type *"questions"*
*Back to menu?* Type *"menu"*`;
  }

  // Default response for unrecognized input
  return `🤖 I didn't quite understand that.

Here are some things you can try:

• Type *"menu"* for main options
• Type *"help"* for assistance
• Type *"contact"* for our details
• Use numbers 1-8 for specific services

Or simply tell me what you're looking for, and I'll help you find the right solution!

*What can I help you with today?* 🚀`;
}

exports.handler = async (event, context) => {
  try {
    // Parse the path and method from Netlify event
    const path = event.path.replace('/.netlify/functions/api', '') || '/';
    const method = event.httpMethod.toLowerCase();
    
    // Parse request body
    let body = {};
    if (event.body) {
      try {
        body = JSON.parse(event.body);
      } catch (e) {
        body = {};
      }
    }

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };

    // Handle OPTIONS requests (CORS preflight)
    if (method === 'options') {
      return { statusCode: 200, headers, body: '' };
    }

    // HEALTH CHECK ENDPOINTS
    if (path === '/api/v1/twilio/health' || path === '/api/v1/exotel/health') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'OK',
          message: 'Exotel Calling Service is running',
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'production'
        })
      };
    }

    // CHATBOT ENDPOINTS
    if (path === '/api/v1/chatbot/chat' && method === 'post') {
      try {
        const { AIPoweredAdlyncChatbotService } = require('../../dist/chatbot/services/ai-powered-adlync-chatbot.service');
        const configService = createMockConfigService();
        const chatbotService = new AIPoweredAdlyncChatbotService(configService);
        
        const message = body.message || 'Hello';
        const sessionId = body.sessionId;
        const userId = body.userId;
        
        const response = await chatbotService.processMessage(message, sessionId, userId);
        return { statusCode: 200, headers, body: JSON.stringify(response) };
      } catch (error) {
        console.error('Chatbot error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ success: false, message: 'Chatbot service error', error: error.message })
        };
      }
    }

    // TWILIO ENDPOINTS
    if (path.startsWith('/api/v1/twilio/') && method === 'post') {
      try {
        // Simple mock responses for Twilio endpoints
        if (path === '/api/v1/twilio/initiate-call') {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              message: 'Call initiated successfully',
              callId: 'mock-call-' + Date.now(),
              data: { phoneNumber: body.phoneNumber, status: 'initiated' }
            })
          };
        }
        
        if (path === '/api/v1/twilio/send-sms') {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              message: 'SMS sent successfully',
              messageId: 'mock-sms-' + Date.now(),
              data: { to: body.to, message: body.message }
            })
          };
        }
        
        if (path === '/api/v1/twilio/send-whatsapp') {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              message: 'WhatsApp message sent successfully',
              messageId: 'mock-wa-' + Date.now(),
              data: { to: body.to, message: body.message }
            })
          };
        }
        
        if (path === '/api/v1/twilio/send-email') {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              message: 'Email sent successfully',
              messageId: 'mock-email-' + Date.now(),
              data: { to: body.to, subject: body.subject }
            })
          };
        }
        
      } catch (error) {
        console.error('Twilio service error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ success: false, message: 'Twilio service error', error: error.message })
        };
      }
    }

    // TWILIO WHATSAPP WEBHOOK ENDPOINTS
    if (path === '/twilio/incoming-whatsapp' && method === 'post') {
      try {
        console.log('Incoming WhatsApp webhook:', body);
        
        // Parse Twilio webhook data (comes as form-encoded, not JSON)
        let webhookData = {};
        if (event.body && !event.body.startsWith('{')) {
          // Parse form-encoded data
          const params = new URLSearchParams(event.body);
          webhookData = Object.fromEntries(params);
        } else {
          webhookData = body;
        }

        const fromNumber = webhookData.From || webhookData.from;
        const messageBody = (webhookData.Body || webhookData.body || webhookData.message || '').toLowerCase().trim();
        const profileName = webhookData.ProfileName || webhookData.profileName || 'User';

        console.log('WhatsApp message received:', { fromNumber, messageBody, profileName });

        if (!messageBody) {
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'ok' })
          };
        }

        // Use the comprehensive chatbot logic from Twilio controller
        const responseMessage = generateChatbotResponse(messageBody, fromNumber);
        
        console.log('Sending WhatsApp response:', responseMessage.substring(0, 100) + '...');

        // Send response via Twilio API (not TwiML)
        const axios = require('axios');
        const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
        const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
        
        if (twilioAccountSid && twilioAuthToken) {
          try {
            const twilioResponse = await axios.post(
              `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
              new URLSearchParams({
                To: fromNumber,
                From: webhookData.To || webhookData.to,
                Body: responseMessage
              }),
              {
                auth: {
                  username: twilioAccountSid,
                  password: twilioAuthToken
                },
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              }
            );
            console.log('✅ WhatsApp response sent successfully:', twilioResponse.data?.sid);
          } catch (twilioError) {
            console.error('❌ Failed to send WhatsApp response:', twilioError.response?.data || twilioError.message);
          }
        }

        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'ok' })
        };

      } catch (error) {
        console.error('WhatsApp webhook error:', error);
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'error', message: error.message })
        };
      }
    }

    // VAPI ENDPOINTS
    if (path.startsWith('/vapi/') || path.startsWith('/api/v1/vapi/')) {
      try {
        // Real VAPI service calls
        if (path.includes('/initiate-call') && method === 'post') {
          const axios = require('axios');
          
          const vapiPrivateKey = process.env.VAPI_PRIVATE_KEY;
          const vapiBaseUrl = process.env.VAPI_BASE_URL || 'https://api.vapi.ai';
          
          if (!vapiPrivateKey) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({
                success: false,
                message: 'VAPI_PRIVATE_KEY not configured in environment variables'
              })
            };
          }

          const payload = {
            phoneNumberId: '3f0ba1fc-4de5-46ee-bd82-0ea1aeae9922', // Your Vapi phone number ID
            customer: {
              number: body.phoneNumber,
              name: body.customerName,
              email: body.customerEmail,
            },
            assistantId: body.assistantId,
            metadata: {
              source: 'netlify-serverless',
              ...body.metadata,
            },
          };

          try {
            const response = await axios.post(`${vapiBaseUrl}/call`, payload, {
              headers: {
                'Authorization': `Bearer ${vapiPrivateKey}`,
                'Content-Type': 'application/json',
              },
              timeout: 30000,
            });

            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({
                success: true,
                callId: response.data?.id,
                message: 'AI voice call initiated successfully',
                data: response.data,
              })
            };
          } catch (apiError) {
            console.error('VAPI API Error:', apiError.response?.data || apiError.message);
            return {
              statusCode: 500,
              headers,
              body: JSON.stringify({
                success: false,
                message: 'Failed to initiate VAPI call',
                error: apiError.response?.data || apiError.message
              })
            };
          }
        }
        
        if (path.includes('/create-assistant') && method === 'post') {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              message: 'Assistant created successfully',
              data: {
                id: 'assistant-' + Date.now(),
                name: 'Adlync Solutions AI Assistant',
                status: 'active'
              }
            })
          };
        }
        
        if (path.includes('/assistants') && method === 'get') {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              message: 'Assistants retrieved successfully',
              data: [
                {
                  id: 'assistant-1',
                  name: 'Adlync Solutions AI Assistant',
                  status: 'active',
                  created: new Date().toISOString()
                }
              ]
            })
          };
        }
        
        if (path.includes('/phone-numbers') && method === 'get') {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              message: 'Phone numbers retrieved successfully',
              data: [
                {
                  id: 'phone-1',
                  number: '+1234567890',
                  status: 'active',
                  provider: 'vapi'
                }
              ]
            })
          };
        }
        
      } catch (error) {
        console.error('VAPI service error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ success: false, message: 'VAPI service error', error: error.message })
        };
      }
    }

    // DEFAULT RESPONSE - API INFO
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Exotel Calling Service API',
        path: path,
        method: method,
        available_endpoints: [
          'GET /api/v1/twilio/health',
          'GET /api/v1/exotel/health',
          'POST /api/v1/chatbot/chat',
          'POST /api/v1/twilio/initiate-call',
          'POST /api/v1/twilio/send-sms',
          'POST /api/v1/twilio/send-whatsapp',
          'POST /api/v1/twilio/send-email',
          'POST /vapi/initiate-call',
          'POST /vapi/create-assistant',
          'GET /vapi/assistants',
          'GET /vapi/phone-numbers'
        ]
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message
      })
    };
  }
};