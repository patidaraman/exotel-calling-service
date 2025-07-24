# Exotel AI Calling Service

A robust NestJS-based service for integrating with Exotel's calling API to handle automated voice calls, IVR responses, and call management.

## Features

- 🚀 **Automated Call Initiation**: Programmatically initiate calls through Exotel API
- 📞 **IVR Handling**: Interactive Voice Response with customizable prompts
- 📊 **Call Status Tracking**: Real-time call status updates and history
- 🔒 **Input Validation**: Comprehensive request validation using class-validator
- 🛡️ **Error Handling**: Robust error handling with proper HTTP status codes
- 📝 **Logging**: Detailed logging for debugging and monitoring
- 🌐 **Webhook Support**: Handle Exotel webhooks for call status updates
- ⚡ **Health Checks**: Built-in health check endpoints

## Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm
- Exotel account with API credentials

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd exotel-calling-service

# Install dependencies
pnpm install

# Copy environment file and configure
cp .env.example .env
```

## Configuration

Update the `.env` file with your Exotel credentials:

```env
# Application Configuration
NODE_ENV=${NODE_ENV}
PORT=${PORT}
APP_BASE_URL=https://your-server.com

# Exotel Configuration
EXOTEL_SID=your-exotel-sid
EXOTEL_TOKEN=your-exotel-token
EXOTEL_VIRTUAL_NUMBER=your-exophone
EXOTEL_BASE_URL=https://api.exotel.com/v1
```

## Running the Application

```bash
# Development mode
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod

# Debug mode
pnpm run start:debug
```

## API Endpoints

### Call Management

#### Initiate Call
```http
POST /api/v1/exotel/initiate-call
Content-Type: application/json

{
  "to": "+919876543210",
  "message": "Optional custom message",
  "callType": "trans"
}
```

#### Get Call Status
```http
GET /api/v1/exotel/call-status/{callSid}
```

#### Get Call History
```http
GET /api/v1/exotel/call-history?limit=20
```

#### Health Check
```http
GET /api/v1/exotel/health
```

### Webhook Endpoints (No API prefix)

#### IVR Response Handler
```http
POST /exotel/ivr-response
```

#### Gather Response Handler
```http
POST /exotel/gather-response
```

#### Call Status Webhook
```http
POST /exotel/call-status
```

## IVR Flow

The service implements a simple IVR flow:

1. **Initial Prompt**: Greets the caller and presents options
   - Press 1: Confirm receipt
   - Press 2: Connect to agent
   - Press 9: End call

2. **Response Handling**: Processes user input and provides appropriate responses

## Webhook Configuration

Configure the following webhooks in your Exotel dashboard:

- **IVR URL**: `https://your-domain.com/exotel/ivr-response`
- **Status Callback URL**: `https://your-domain.com/exotel/call-status`

## Error Handling

The service includes comprehensive error handling:

- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Invalid Exotel credentials
- **403 Forbidden**: Insufficient permissions
- **500 Internal Server Error**: Service errors

## Logging

Detailed logging is implemented throughout the application:

- Request/response logging
- Error tracking
- Call status updates
- IVR interactions

## Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## Development

```bash
# Lint code
pnpm run lint

# Format code
pnpm run format

# Watch mode for ${NODE_ENV}
pnpm run start:dev
```

## Deployment

### Environment Variables

Ensure the following environment variables are set in production:

- `NODE_ENV=${NODE_ENV}`
- `PORT=${PORT}`
- `APP_BASE_URL=https://your-production-domain.com`
- `EXOTEL_SID=your-production-sid`
- `EXOTEL_TOKEN=your-production-token`
- `EXOTEL_VIRTUAL_NUMBER=your-production-exophone`

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE ${PORT}
CMD ["node", "dist/main"]
```

## Security Considerations

- Store sensitive credentials in environment variables
- Use HTTPS in production
- Implement rate limiting for public endpoints
- Validate webhook signatures (if supported by Exotel)

## Monitoring

- Health check endpoint: `/api/v1/exotel/health`
- Application logs include structured logging
- Monitor call success rates and error patterns

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the logs for detailed error information
- Verify Exotel credentials and configuration
- Ensure webhook URLs are accessible from Exotel servers
- Review the Exotel API documentation for latest updates
