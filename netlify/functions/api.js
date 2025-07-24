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
        const { TwilioService } = require('../../dist/twilio/twilio.service');
        const { HttpService } = require('@nestjs/axios');
        const configService = createMockConfigService();
        
        // Mock HttpService
        const httpService = {
          post: () => ({ toPromise: () => Promise.resolve({ data: { success: true } }) })
        };
        
        const twilioService = new TwilioService(configService, httpService);

        if (path === '/api/v1/twilio/initiate-call') {
          const response = await twilioService.initiateCall(body);
          return { statusCode: 200, headers, body: JSON.stringify(response) };
        }
        
        if (path === '/api/v1/twilio/send-sms') {
          const response = await twilioService.sendSMS(body);
          return { statusCode: 200, headers, body: JSON.stringify(response) };
        }
        
        if (path === '/api/v1/twilio/send-whatsapp') {
          const response = await twilioService.sendWhatsApp(body);
          return { statusCode: 200, headers, body: JSON.stringify(response) };
        }
        
        if (path === '/api/v1/twilio/send-email') {
          const response = await twilioService.sendEmail(body);
          return { statusCode: 200, headers, body: JSON.stringify(response) };
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

    // VAPI ENDPOINTS
    if (path.startsWith('/vapi/') || path.startsWith('/api/v1/vapi/')) {
      try {
        const { VapiService } = require('../../dist/vapi/vapi.service');
        const { HttpService } = require('@nestjs/axios');
        const configService = createMockConfigService();
        
        // Mock HttpService for VAPI
        const httpService = {
          post: () => ({ toPromise: () => Promise.resolve({ data: { success: true, id: 'mock-id' } }) }),
          get: () => ({ toPromise: () => Promise.resolve({ data: { success: true } }) })
        };
        
        const vapiService = new VapiService(configService, httpService);

        if (path.includes('/initiate-call') && method === 'post') {
          const response = await vapiService.initiateCall(body);
          return { statusCode: 200, headers, body: JSON.stringify(response) };
        }
        
        if (path.includes('/create-assistant') && method === 'post') {
          const response = await vapiService.createAssistant();
          return { statusCode: 200, headers, body: JSON.stringify(response) };
        }
        
        if (path.includes('/assistants') && method === 'get') {
          const response = await vapiService.listAssistants();
          return { statusCode: 200, headers, body: JSON.stringify(response) };
        }
        
        if (path.includes('/phone-numbers') && method === 'get') {
          const response = await vapiService.listPhoneNumbers();
          return { statusCode: 200, headers, body: JSON.stringify(response) };
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