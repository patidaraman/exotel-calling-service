import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });

    const configService = app.get(ConfigService);
    const port = configService.get<number>('port') || parseInt(process.env.DEFAULT_PORT, 10);
    const environment = configService.get<string>('app.environment');

    // Enable CORS for webhook endpoints
    app.enableCors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Add global prefix for API routes
    app.setGlobalPrefix('api/v1', {
      exclude: [
        '/exotel/ivr-response',
        '/exotel/gather-response',
        '/exotel/call-status',
        '/twilio/voice-response',
        '/twilio/gather-response',
        '/twilio/recording-complete',
        '/twilio/call-status',
        '/twilio/sms-status',
        '/twilio/whatsapp-status',
        '/twilio/incoming-sms',
        '/twilio/incoming-whatsapp',
        '/twilio/ai-agent-response',
        '/twilio/account-menu',
        '/twilio/ai-followup',
        '/twilio/post-recording-menu',
        '/twilio/callback-request',
      ],
    });

    await app.listen(port);

    logger.log(`🚀 Application is running on: http://localhost:${port}`);
    logger.log(
      `📱 Exotel webhooks available at: http://localhost:${port}/exotel/`,
    );
    logger.log(
      `📞 Twilio webhooks available at: http://localhost:${port}/twilio/`,
    );
    logger.log(`🌍 Environment: ${environment}`);
    logger.log(`📊 Health checks:`);
    logger.log(`   - Exotel: http://localhost:${port}/api/v1/exotel/health`);
    logger.log(`   - Twilio: http://localhost:${port}/api/v1/twilio/health`);
    logger.log(`   - Chatbot: http://localhost:${port}/api/v1/chatbot/health`);
    logger.log(`🤖 Chatbot API: http://localhost:${port}/api/v1/chatbot/chat`);
  } catch (error) {
    logger.error('❌ Error starting the application', error);
    process.exit(1);
  }
}

bootstrap();
