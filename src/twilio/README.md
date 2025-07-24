# Twilio Integration Service

This module provides comprehensive Twilio integration for voice calls, SMS, WhatsApp, and email services using SendGrid.

## Features

### 🎯 **Voice Calls**
- Initiate outbound calls
- Interactive Voice Response (IVR)
- Call recording
- Call status tracking
- TwiML responses

### 📱 **SMS**
- Send SMS messages
- Receive SMS messages
- SMS status tracking
- Media attachments support

### 💬 **WhatsApp**
- Send WhatsApp messages
- Receive WhatsApp messages
- Media support
- Status tracking

### 📧 **Email (via SendGrid)**
- Send emails with HTML/text content
- Attachments support
- Email templates

## Setup

### 1. Twilio Account Setup
1. Create a free Twilio account at [twilio.com](https://www.twilio.com)
2. Get your Account SID and Auth Token from the console
3. Purchase a phone number for voice/SMS
4. Set up WhatsApp sandbox for testing

### 2. SendGrid Setup (for Email)
1. Create a SendGrid account
2. Generate an API key
3. Verify sender identity

### 3. Environment Configuration
Update your `.env` file:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
SENDGRID_API_KEY=your-sendgrid-api-key
```

## API Endpoints

### Voice Calls

#### Initiate Call
```bash
POST /api/v1/twilio/initiate-call
Content-Type: application/json

{
  "to": "+1234567890",
  "from": "+0987654321",
  "url": "https://your-domain.com/twilio/voice-response"
}
```

#### Get Call Status
```bash
GET /api/v1/twilio/call-status/{callSid}
```

### SMS

#### Send SMS
```bash
POST /api/v1/twilio/send-sms
Content-Type: application/json

{
  "to": "+1234567890",
  "from": "+0987654321",
  "body": "Hello from Twilio!"
}
```

#### Get SMS Status
```bash
GET /api/v1/twilio/sms-status/{messageSid}
```

### WhatsApp

#### Send WhatsApp Message
```bash
POST /api/v1/twilio/send-whatsapp
Content-Type: application/json

{
  "to": "whatsapp:+1234567890",
  "from": "whatsapp:+14155238886",
  "body": "Hello from WhatsApp!"
}
```

### Email

#### Send Email
```bash
POST /api/v1/twilio/send-email
Content-Type: application/json

{
  "to": "recipient@example.com",
  "from": "sender@example.com",
  "subject": "Test Email",
  "text": "Hello from SendGrid!",
  "html": "<h1>Hello from SendGrid!</h1>"
}
```

### Account Information

#### Get Account Info
```bash
GET /api/v1/twilio/account-info
```

#### Get Phone Numbers
```bash
GET /api/v1/twilio/phone-numbers
```

## Webhook Endpoints

These endpoints handle incoming webhooks from Twilio:

- `POST /twilio/voice-response` - Handle incoming calls
- `POST /twilio/gather-response` - Handle DTMF input
- `POST /twilio/recording-complete` - Handle recording completion
- `POST /twilio/call-status` - Handle call status updates
- `POST /twilio/sms-status` - Handle SMS status updates
- `POST /twilio/whatsapp-status` - Handle WhatsApp status updates
- `POST /twilio/incoming-sms` - Handle incoming SMS
- `POST /twilio/incoming-whatsapp` - Handle incoming WhatsApp

## Testing

### 1. Health Check
```bash
curl http://localhost:3000/api/v1/twilio/health
```

### 2. Test Voice Call
```bash
curl -X POST http://localhost:3000/api/v1/twilio/initiate-call \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890",
    "from": "+0987654321"
  }'
```

### 3. Test SMS
```bash
curl -X POST http://localhost:3000/api/v1/twilio/send-sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890",
    "from": "+0987654321",
    "body": "Test SMS from Twilio API"
  }'
```

### 4. Test WhatsApp
```bash
curl -X POST http://localhost:3000/api/v1/twilio/send-whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "to": "whatsapp:+1234567890",
    "from": "whatsapp:+14155238886",
    "body": "Test WhatsApp message"
  }'
```

### 5. Test Email
```bash
curl -X POST http://localhost:3000/api/v1/twilio/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "from": "sender@example.com",
    "subject": "Test Email",
    "text": "This is a test email from SendGrid"
  }'
```

## Webhook Configuration

In your Twilio console, configure webhooks:

1. **Voice URL**: `https://your-domain.com/twilio/voice-response`
2. **SMS URL**: `https://your-domain.com/twilio/incoming-sms`
3. **WhatsApp URL**: `https://your-domain.com/twilio/incoming-whatsapp`
4. **Status Callback URLs**: 
   - Calls: `https://your-domain.com/twilio/call-status`
   - SMS: `https://your-domain.com/twilio/sms-status`
   - WhatsApp: `https://your-domain.com/twilio/whatsapp-status`

## Error Handling

The service includes comprehensive error handling:

- **400**: Invalid request parameters
- **401**: Invalid Twilio credentials
- **403**: Insufficient permissions
- **500**: Service temporarily unavailable

## Logging

All operations are logged with detailed information:
- Request/response data
- Error details
- Webhook events
- Status updates

## Security

- All credentials are stored in environment variables
- Webhook endpoints validate Twilio signatures (recommended)
- Input validation using class-validator
- Proper error handling without exposing sensitive data

## Free Tier Limitations

### Twilio Free Trial:
- $15.50 credit for testing
- Trial phone numbers have "trial account" message
- Limited to verified phone numbers

### SendGrid Free Tier:
- 100 emails per day
- Single sender verification required

## Production Considerations

1. **Webhook Security**: Implement Twilio signature validation
2. **Rate Limiting**: Add rate limiting for API endpoints
3. **Database**: Store call/message logs in database
4. **Monitoring**: Add monitoring and alerting
5. **Scaling**: Consider using queues for high-volume operations