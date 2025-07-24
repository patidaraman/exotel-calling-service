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

exports.handler = async (event, context) => {
  try {
    const nestApp = await bootstrap();
    
    // Parse the path and method from Netlify event
    const path = event.path.replace('/.netlify/functions/api', '') || '/';
    const method = event.httpMethod.toLowerCase();
    
    // Create a mock Express request/response
    const req = {
      method: event.httpMethod,
      url: path,
      headers: event.headers || {},
      body: event.body ? JSON.parse(event.body) : {},
      query: event.queryStringParameters || {},
      params: {}
    };

    // Simple routing for health check
    if (path === '/api/v1/twilio/health' || path === '/api/v1/exotel/health') {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        },
        body: JSON.stringify({
          status: 'OK',
          message: 'Exotel Calling Service is running',
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'production'
        })
      };
    }

    // For other routes, return a basic response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: JSON.stringify({
        message: 'Exotel Calling Service API',
        path: path,
        method: method,
        available_endpoints: [
          'GET /api/v1/twilio/health',
          'GET /api/v1/exotel/health',
          'POST /api/v1/twilio/initiate-call',
          'POST /api/v1/chatbot/chat'
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