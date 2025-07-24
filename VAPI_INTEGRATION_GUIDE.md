# Complete Vapi + Twilio Integration Guide for Adlync Solutions

## 🎯 Overview
This guide will help you integrate Vapi (Voice AI) with your existing Twilio setup to create AI-powered voice calls for your digital marketing business.

## 📋 Prerequisites
- ✅ Vapi Developer Account
- ✅ Twilio Account with Sandbox Number
- ✅ Your existing NestJS application

## 🔑 Your Credentials
```
Vapi Private Key: 5c901033-4659-45ee-90ca-45b4dba5ac57
Vapi Public Key: 77703e61-b92a-429b-b69f-783b9e8c1bff
Twilio Number: +14155238886
```

## 🚀 Step 1: Environment Setup

### 1.1 Add to your `.env` file:
```env
# Vapi Configuration
VAPI_PRIVATE_KEY=5c901033-4659-45ee-90ca-45b4dba5ac57
VAPI_PUBLIC_KEY=77703e61-b92a-429b-b69f-783b9e8c1bff
VAPI_BASE_URL=https://api.vapi.ai
```

## 🎙️ Step 2: Vapi Dashboard Configuration

### 2.1 Create AI Assistant in Vapi Dashboard

1. **Login to Vapi**: https://dashboard.vapi.ai/
2. **Go to**: Assistants → Create New Assistant
3. **Configure each section**:

#### **Model Section:**
```
Provider: OpenAI
Model: gpt-4o-mini
Temperature: 0.7
Max Tokens: 150
System Message: "You are an AI assistant for Adlync Solutions, a digital marketing company specializing in AI videos (₹5,000+), social media marketing (₹15,000/month), and digital transformation (₹25,000/month). Be professional, helpful, and always offer free consultations. Ask specific questions about their business needs."
```

#### **Voice Section:**
```
Provider: 11Labs
Voice: Rachel (or any professional female voice)
Stability: 0.5
Similarity Boost: 0.8
Speed: 1.0
```

#### **Transcriber Section:**
```
Provider: Deepgram
Model: nova-2
Language: en
```

#### **Advanced Section:**
```
First Message: "Hello! Thank you for calling Adlync Solutions. I'm your AI assistant ready to help you with our digital marketing services. How can I assist you today?"

End Call Message: "Thank you for calling Adlync Solutions. Our team will follow up with you soon. Have a great day!"

Max Duration: 600 seconds
Silence Timeout: 30 seconds
Recording: Enabled
```

### 2.2 Save Assistant ID
- After creating, **copy the Assistant ID** (starts with `asst_`)

## 🔧 Step 3: Start Your Application

### 3.1 Install Dependencies (if needed):
```bash
npm install @nestjs/axios
```

### 3.2 Start the server:
```bash
npm run start:dev
```

### 3.3 Verify Vapi service is running:
```bash
curl http://localhost:3000/vapi/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-01-24T...",
  "service": "Vapi AI Voice Service"
}
```

## 🧪 Step 4: Testing

### 4.1 Create Assistant via API:
```bash
curl -X POST http://localhost:3000/vapi/create-assistant \
  -H "Content-Type: application/json"
```

### 4.2 List Assistants:
```bash
curl http://localhost:3000/vapi/assistants
```

### 4.3 Test Call to Verified Number:
```bash
curl -X POST http://localhost:3000/vapi/initiate-call \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+917566873233",
    "customerName": "Test Customer",
    "assistantId": "YOUR_ASSISTANT_ID_HERE"
  }'
```

## 📞 Step 5: Call Flow Process

### 5.1 How It Works:
```
1. User requests call → Your API endpoint
2. API calls Vapi → Vapi initiates call via Twilio
3. User answers → AI assistant starts conversation
4. AI handles conversation → Natural language processing
5. Call ends → Webhook notifies your system
```

### 5.2 Integration with Website:
```html
<!-- Add Call Request Button to WordPress -->
<button onclick="requestCallback()">Request AI Call Back</button>

<script>
function requestCallback() {
    const phoneNumber = prompt("Enter your phone number:");
    if (phoneNumber) {
        fetch('/vapi/initiate-call', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                customerName: 'Website Visitor'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('AI assistant will call you shortly!');
            } else {
                alert('Error: ' + data.message);
            }
        });
    }
}
</script>
```

## 🔗 Step 6: Webhook Configuration

### 6.1 Set Webhook URL in Vapi Dashboard:
```
Webhook URL: https://YOUR_NGROK_URL.ngrok-free.app/vapi/webhook
Events: call-started, call-ended, transcript
```

### 6.2 Your webhook will receive:
- **call-started**: When call begins
- **call-ended**: When call ends with duration
- **transcript**: Real-time conversation text
- **function-call**: If AI needs to trigger actions

## 📊 Step 7: Available API Endpoints

### 7.1 Your Vapi Endpoints:
```
GET  /vapi/health              - Health check
POST /vapi/create-assistant    - Create AI assistant
GET  /vapi/assistants          - List all assistants
POST /vapi/initiate-call       - Start AI voice call
GET  /vapi/call-status/:callId - Get call status
POST /vapi/test-call           - Test call to verified number
POST /vapi/webhook             - Receive Vapi events
```

### 7.2 Example Call Request:
```json
{
  "phoneNumber": "+917566873233",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "assistantId": "asst_xyz123",
  "metadata": {
    "source": "website",
    "campaign": "digital-marketing"
  }
}
```

## 🎯 Step 8: Business Use Cases

### 8.1 Lead Qualification:
- AI calls potential customers
- Asks about business needs
- Qualifies leads automatically
- Schedules follow-up calls

### 8.2 Customer Support:
- Handles common inquiries
- Provides service information
- Transfers to human when needed

### 8.3 Appointment Booking:
- AI schedules consultations
- Confirms availability
- Sends calendar invites

## 🚨 Important Notes

### 8.1 Twilio Sandbox Limitations:
- Only verified numbers can receive calls
- For production, you need a real Twilio phone number

### 8.2 Vapi Pricing:
- Pay per minute of conversation
- Check current rates at vapi.ai/pricing

### 8.3 Testing Numbers:
Your verified numbers for testing:
- +917566873233
- +916232479990
- +916265231061
- +918349364109
- +918965992254

## 🔧 Troubleshooting

### Common Issues:
1. **401 Authentication Error**: Check Vapi private key
2. **Call not connecting**: Verify phone number format
3. **No webhook events**: Check ngrok URL accessibility
4. **Assistant not responding**: Verify assistant configuration

### Debug Commands:
```bash
# Check service health
curl http://localhost:3000/vapi/health

# Test assistant creation
curl -X POST http://localhost:3000/vapi/create-assistant

# Check logs
tail -f logs/application.log
```

## 🎉 Next Steps

1. **Configure Vapi Assistant** in dashboard
2. **Test with verified numbers**
3. **Set up webhooks** for call tracking
4. **Integrate with WordPress** for callback requests
5. **Monitor call analytics** in Vapi dashboard

## 📞 Support

If you need help:
- Check Vapi documentation: https://docs.vapi.ai/
- Review your application logs
- Test with curl commands provided above

---

**Ready to transform your customer engagement with AI voice calls!** 🚀