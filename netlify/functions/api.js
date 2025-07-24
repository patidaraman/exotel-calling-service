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
        const messageBody = webhookData.Body || webhookData.body || webhookData.message;
        const profileName = webhookData.ProfileName || webhookData.profileName || 'User';

        console.log('WhatsApp message received:', { fromNumber, messageBody, profileName });

        if (!messageBody) {
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'text/xml' },
            body: '<?xml version="1.0" encoding="UTF-8"?><Response></Response>'
          };
        }

        // Process message with chatbot
        const { AIPoweredAdlyncChatbotService } = require('../../dist/chatbot/services/ai-powered-adlync-chatbot.service');
        const configService = createMockConfigService();
        const chatbotService = new AIPoweredAdlyncChatbotService(configService);
        
        const chatResponse = await chatbotService.processMessage(messageBody, fromNumber, profileName);
        
        // Create TwiML response
        const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${chatResponse.message}</Message>
</Response>`;

        console.log('Sending WhatsApp response:', chatResponse.message);

        return {
          statusCode: 200,
          headers: { 'Content-Type': 'text/xml' },
          body: twimlResponse
        };

      } catch (error) {
        console.error('WhatsApp webhook error:', error);
        
        // Return a fallback response
        const fallbackResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Hello! Thanks for contacting Adlync Solutions. We're AI automation experts with 5+ years experience. Our clients often see 300% lead growth. How can we help transform your business? 🚀</Message>
</Response>`;

        return {
          statusCode: 200,
          headers: { 'Content-Type': 'text/xml' },
          body: fallbackResponse
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