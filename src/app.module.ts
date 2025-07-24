import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { TwilioService } from './twilio/twilio.service';
import { TwilioController } from './twilio/twilio.controller';
import { SimpleChatbotModule } from './chatbot/simple-chatbot.module';
import { VapiModule } from './vapi/vapi.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    SimpleChatbotModule,
    VapiModule,
  ],
  providers: [
    TwilioService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  controllers: [TwilioController],
})
export class AppModule {}
