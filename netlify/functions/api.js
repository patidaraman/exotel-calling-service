const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../../dist/app.module');
const serverlessExpress = require('@vendia/serverless-express');

let server;

async function bootstrap() {
  if (!server) {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix('api');
    await app.init();
    
    const expressApp = app.getHttpAdapter().getInstance();
    server = serverlessExpress({ app: expressApp });
  }
  return server;
}

exports.handler = async (event, context) => {
  const server = await bootstrap();
  return server(event, context);
};