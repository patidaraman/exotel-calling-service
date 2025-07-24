export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  exotel: {
    accountSid: process.env.EXOTEL_ACCOUNT_SID,
    apiKey: process.env.EXOTEL_API_KEY,
    apiToken: process.env.EXOTEL_API_TOKEN,
    virtualNumber: process.env.EXOTEL_VIRTUAL_NUMBER,
    baseUrl: process.env.EXOTEL_BASE_URL || 'https://api.exotel.com/v1',
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER,
    sendGridApiKey: process.env.SENDGRID_API_KEY,
  },
  vapi: {
    privateKey: process.env.VAPI_PRIVATE_KEY,
    publicKey: process.env.VAPI_PUBLIC_KEY,
    baseUrl: process.env.VAPI_BASE_URL || 'https://api.vapi.ai',
  },
  app: {
    baseUrl: process.env.APP_BASE_URL,
    environment: process.env.NODE_ENV || 'development',
  },
});