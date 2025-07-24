import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Param,
  Logger,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { TwilioService } from './twilio.service';
import {
  InitiateCallDto,
  SendSmsDto,
  SendWhatsAppDto,
  SendEmailDto,
  BulkWhatsAppDto,
  TwilioResponseDto,
} from './dto/twilio.dto';

@Controller('twilio')
export class TwilioController {
  private readonly logger = new Logger(TwilioController.name);

  constructor(private readonly twilioService: TwilioService) {}

  // Voice Call Endpoints
  @Post('initiate-call')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async initiateCall(
    @Body() callData: InitiateCallDto,
  ): Promise<TwilioResponseDto> {
    this.logger.log(
      `Received call initiation request from: ${callData.from} to: ${callData.to}`,
    );
    return this.twilioService.initiateCall(callData);
  }

  @Get('call-status/:callSid')
  async getCallStatus(
    @Param('callSid') callSid: string,
  ): Promise<TwilioResponseDto> {
    this.logger.log(`Received call status request for CallSid: ${callSid}`);
    return this.twilioService.getCallStatus(callSid);
  }

  // SMS Endpoints
  @Post('send-sms')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async sendSms(@Body() smsData: SendSmsDto): Promise<TwilioResponseDto> {
    this.logger.log(
      `Received SMS request from: ${smsData.from} to: ${smsData.to}`,
    );
    return this.twilioService.sendSms(smsData);
  }

  @Get('sms-status/:messageSid')
  async getSmsStatus(
    @Param('messageSid') messageSid: string,
  ): Promise<TwilioResponseDto> {
    this.logger.log(
      `Received SMS status request for MessageSid: ${messageSid}`,
    );
    return this.twilioService.getSmsStatus(messageSid);
  }

  // WhatsApp Endpoints
  @Post('send-whatsapp')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async sendWhatsApp(
    @Body() whatsAppData: SendWhatsAppDto,
  ): Promise<TwilioResponseDto> {
    this.logger.log(
      `Received WhatsApp request from: ${whatsAppData.from} to: ${whatsAppData.to}`,
    );
    return this.twilioService.sendWhatsApp(whatsAppData);
  }

  @Post('send-bulk-whatsapp')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async sendBulkWhatsApp(
    @Body() bulkData: BulkWhatsAppDto,
  ): Promise<TwilioResponseDto> {
    this.logger.log(
      `Received bulk WhatsApp request for ${bulkData.phoneNumbers.length} numbers`,
    );
    return this.twilioService.sendBulkWhatsApp(bulkData);
  }

  // Email Endpoints
  @Post('send-email')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async sendEmail(@Body() emailData: SendEmailDto): Promise<TwilioResponseDto> {
    this.logger.log(
      `Received email request from: ${emailData.from} to: ${emailData.to}`,
    );
    return this.twilioService.sendEmail(emailData);
  }

  // Account Info Endpoints
  @Get('account-info')
  async getAccountInfo(): Promise<TwilioResponseDto> {
    this.logger.log('Received account info request');
    return this.twilioService.getAccountInfo();
  }

  @Get('phone-numbers')
  async getPhoneNumbers(): Promise<TwilioResponseDto> {
    this.logger.log('Received phone numbers request');
    return this.twilioService.getPhoneNumbers();
  }

  @Get('available-numbers/:countryCode')
  async getAvailableNumbers(
    @Param('countryCode') countryCode: string,
  ): Promise<TwilioResponseDto> {
    this.logger.log(
      `Received available numbers request for country: ${countryCode}`,
    );
    return this.twilioService.getAvailableNumbers(countryCode);
  }

  @Get('trial-info')
  async getTrialInfo(): Promise<TwilioResponseDto> {
    this.logger.log('Received trial info request');
    return this.twilioService.getTrialInfo();
  }

  // Advanced AI Voice Response - ADLYNC SOLUTIONS
  @Post('voice-response')
  handleVoiceResponse(@Body() body: any, @Res() res: Response) {
    this.logger.log('🎯 AI Voice Assistant - Call Started');
    this.logger.log('Call Details:', body);
    
    res.set('Content-Type', 'text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="/twilio/gather-response" method="POST" timeout="10" finishOnKey="">
    <Say voice="alice" language="en-US">Welcome to Adlync Solutions! I'm your AI-powered digital marketing assistant.</Say>
    <Pause length="1"/>
    <Say voice="alice" language="en-US">We specialize in AI videos, social media marketing, and complete digital transformation for businesses.</Say>
    <Pause length="1"/>
    <Say voice="alice" language="en-US">Please choose from our service menu: Press 1 for AI Videos and Avatar Videos. Press 2 for Social Media Marketing. Press 3 for Digital Marketing Solutions. Press 4 for Our Portfolio and Success Stories. Press 5 for Pricing and Packages. Press 6 to Book a Free Consultation. Press 7 for Contact Information. Press 8 to Learn About Adlync Solutions. Press 0 to Speak with Our Executive Team. Press 9 to End this Call.</Say>
    <Say voice="alice" language="en-US">Please press a number from 0 to 9, or stay on the line to speak with our executive team.</Say>
  </Gather>
  <Say voice="alice" language="en-US">I understand you'd like to speak with our executive team directly. Please hold while I connect you to one of our specialists.</Say>
  <Dial timeout="30" callerId="+12764449045">+919407385093</Dial>
  <Say voice="alice" language="en-US">I'm sorry, all our executives are currently busy. Let me take your message and have someone call you back within 15 minutes.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Please leave your name, phone number, and a brief message after the beep.</Say>
  <Record action="/twilio/recording-complete" method="POST" maxLength="120" playBeep="true" />
  <Say voice="alice" language="en-US">Thank you! Our executive team will call you back within 15 minutes. Goodbye!</Say>
  <Hangup/>
</Response>`);
  }

  // Advanced AI Gather Response - COMPLETE ADLYNC SOLUTIONS MENU
  @Post('gather-response')
  handleGatherResponse(@Body() body: any, @Res() res: Response) {
    this.logger.log('🎯 AI Voice Assistant - Menu Selection');
    this.logger.log('Selection Details:', body);

    const digits = body.Digits;
    this.logger.log(`🔢 Customer selected option: ${digits}`);

    res.set('Content-Type', 'text/xml');

    switch (digits) {
      case '1': // AI Videos & Avatar Videos
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">Excellent choice! You selected AI Videos and Avatar Videos.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">At Adlync Solutions, we create stunning AI-powered videos including AI Avatar Spokesperson Videos, AI-Generated Product Demos, Personalized Video Messages, and Animated Explainer Videos.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Our AI videos are cost-effective, have quick turnaround of 24 to 48 hours, support multiple languages, include unlimited revisions, and deliver professional quality.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Pricing starts from just 5,000 rupees per video. Would you like to discuss your video requirements? Please describe your project after the beep, or press 0 to return to the main menu.</Say>
  <Gather numDigits="1" action="/twilio/gather-response" method="POST" timeout="5">
    <Record action="/twilio/recording-complete" method="POST" maxLength="60" playBeep="true" />
  </Gather>
  <Redirect>/twilio/voice-response</Redirect>
</Response>`);
        break;

      case '2': // Social Media Marketing
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">Great selection! You chose Social Media Marketing services.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">We offer comprehensive social media management including Instagram and Facebook Management, Content Creation and Design, Paid Advertising Campaigns, Influencer Marketing, Analytics and Reporting, and Community Management.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Our packages include 30 posts per month, daily story updates, targeted ad campaigns, monthly performance reports, and 24/7 support. Packages start from 15,000 rupees per month.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Would you like to discuss your social media goals? Please share your requirements after the beep, or press 0 to return to the main menu.</Say>
  <Gather numDigits="1" action="/twilio/gather-response" method="POST" timeout="5">
    <Record action="/twilio/recording-complete" method="POST" maxLength="60" playBeep="true" />
  </Gather>
  <Redirect>/twilio/voice-response</Redirect>
</Response>`);
        break;

      case '3': // Digital Marketing Solutions
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">Perfect! You selected our Digital Marketing Solutions.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">We provide complete digital transformation including Search Engine Optimization, Google Ads and PPC Campaigns, Website Development and Design, Email Marketing Automation, Brand Strategy and Development, and Lead Generation Systems.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Our clients typically see 300% increase in website traffic, 250% boost in lead generation, 400% improvement in ROI, and achieve top Google rankings. Custom packages start from 25,000 rupees per month.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Interested in a free digital audit? Please tell us about your business after the beep, or press 0 to return to the main menu.</Say>
  <Gather numDigits="1" action="/twilio/gather-response" method="POST" timeout="5">
    <Record action="/twilio/recording-complete" method="POST" maxLength="60" playBeep="true" />
  </Gather>
  <Redirect>/twilio/voice-response</Redirect>
</Response>`);
        break;

      case '4': // Portfolio & Success Stories
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">Wonderful! Let me share our success stories and portfolio.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Case Study 1: For an E-commerce Brand, we achieved 500% increase in online sales, 10x growth in social media followers, and 50 lakh rupees revenue in just 6 months.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Case Study 2: For a Tech Startup, we generated over 1000 qualified leads, achieved number 1 Google ranking, and delivered 300% ROI on ad spend.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Case Study 3: For a Restaurant Chain, we increased foot traffic by 200%, created viral social media campaigns, and helped them open 15 new locations.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Would you like detailed case studies for your industry? Please tell us your business type after the beep, or press 0 to return to the main menu.</Say>
  <Gather numDigits="1" action="/twilio/gather-response" method="POST" timeout="5">
    <Record action="/twilio/recording-complete" method="POST" maxLength="60" playBeep="true" />
  </Gather>
  <Redirect>/twilio/voice-response</Redirect>
</Response>`);
        break;

      case '5': // Pricing & Packages
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">Excellent! Here's our transparent pricing for all services.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">AI Video Packages: Basic package 5,000 rupees for 30-second video, Standard package 10,000 rupees for 60-second video with revisions, Premium package 20,000 rupees for multiple videos.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Social Media Packages: Starter package 15,000 rupees per month, Growth package 25,000 rupees per month, Enterprise package 50,000 rupees per month.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Digital Marketing: SEO Package 20,000 rupees per month, Complete Solution 40,000 rupees per month, Custom Enterprise packages from 1 lakh rupees per month.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Special offers: 20% off first month, free consultation worth 5,000 rupees, and no setup fees. Ready to get started? Press 6 for consultation, or press 0 for main menu.</Say>
  <Gather numDigits="1" action="/twilio/gather-response" method="POST" timeout="10">
    <Say voice="alice" language="en-US">Please make your selection.</Say>
  </Gather>
  <Redirect>/twilio/voice-response</Redirect>
</Response>`);
        break;

      case '6': // Book Free Consultation
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">Fantastic! You've chosen to book a free consultation with our experts.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Our free consultation includes a 30-minute strategy session, complete business analysis and audit, custom marketing plan, ROI projections, and a no-obligation proposal.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">We're available Monday to Friday 10 AM to 6 PM, and Saturday 10 AM to 2 PM. We also provide 24/7 emergency support.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">To book your consultation, please leave your name, business details, preferred time, and contact information after the beep. Our team will call you within 2 hours.</Say>
  <Record action="/twilio/recording-complete" method="POST" maxLength="120" playBeep="true" />
  <Say voice="alice" language="en-US">Perfect! Your consultation request has been recorded. Our expert will contact you within 2 hours. Thank you for choosing Adlync Solutions!</Say>
</Response>`);
        break;

      case '7': // Contact Information
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">Here's how to reach Adlync Solutions.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Our office is located at Adlync Solutions Private Limited, 123 Business Park, Sector 18, Gurgaon, Haryana, 122001.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">You can reach us by phone, WhatsApp, or email at info@adlyncsolutions.com. Visit our website at www.adlyncsolutions.com.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Business hours are Monday to Friday 9 AM to 7 PM, Saturday 10 AM to 4 PM. Sunday is emergency support only.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Follow us on Instagram @adlyncsolutions, LinkedIn Adlync Solutions, and Facebook AdlyncSolutions. Press 0 to return to main menu, or press 6 to book a consultation.</Say>
  <Gather numDigits="1" action="/twilio/gather-response" method="POST" timeout="10">
    <Say voice="alice" language="en-US">Please make your selection.</Say>
  </Gather>
  <Redirect>/twilio/voice-response</Redirect>
</Response>`);
        break;

      case '8': // About Adlync Solutions
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">Thank you for your interest in learning about Adlync Solutions!</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Founded in 2020, we've helped over 500 businesses transform their digital presence using cutting-edge AI technology and proven marketing strategies.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Our team includes 25+ Digital Marketing Experts, AI Technology Specialists, Creative Content Creators, and Data Analytics Professionals.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">We've completed over 500 successful projects, deliver 300% average ROI for clients, won 50+ industry awards, and maintain 99% client satisfaction rate.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Our mission is to democratize digital marketing with AI-powered solutions that deliver measurable results for businesses of all sizes. Ready to join our success story? Press 6 for consultation, or press 0 for main menu.</Say>
  <Gather numDigits="1" action="/twilio/gather-response" method="POST" timeout="10">
    <Say voice="alice" language="en-US">Please make your selection.</Say>
  </Gather>
  <Redirect>/twilio/voice-response</Redirect>
</Response>`);
        break;

      case '9': // End Call
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">Thank you for calling Adlync Solutions! We appreciate your interest in our AI-powered digital marketing services.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Remember, we offer free consultations and 20% off your first month. Visit us at www.adlyncsolutions.com or email info@adlyncsolutions.com.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Have a wonderful day and we look forward to helping transform your business with AI-powered marketing solutions. Goodbye!</Say>
  <Hangup/>
</Response>`);
        break;

      case '0': // Connect to Executive Team
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">You selected to speak with our executive team. Let me connect you to our sales manager.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Please hold while I connect your call.</Say>
  <Dial timeout="30" callerId="+12764449045">+919407385093</Dial>
  <Say voice="alice" language="en-US">I'm sorry, our executive is currently unavailable. Let me take your message and have someone call you back within 15 minutes.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Please leave your name, phone number, and message after the beep.</Say>
  <Record action="/twilio/recording-complete" method="POST" maxLength="60" playBeep="true" />
  <Say voice="alice" language="en-US">Thank you! Our team will call you back within 15 minutes. Goodbye!</Say>
  <Hangup/>
</Response>`);
        break;

      default: // Invalid Selection
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">I'm sorry, that's not a valid option. Please choose a number from 1 to 9.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Let me repeat our service menu for you.</Say>
  <Redirect>/twilio/voice-response</Redirect>
</Response>`);
    }
  }

  // Professional Recording Complete Handler
  @Post('recording-complete')
  handleRecordingComplete(@Body() body: any, @Res() res: Response) {
    try {
      this.logger.log('🎯 AI Voice Assistant - Recording Completed');
      this.logger.log('📋 Recording Details:', {
        recordingUrl: body.RecordingUrl,
        recordingSid: body.RecordingSid,
        callSid: body.CallSid,
        duration: body.RecordingDuration,
      });

      res.set('Content-Type', 'text/xml');
      res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">Excellent! Your message has been recorded successfully and sent to our expert team at Adlync Solutions.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Our specialists will review your requirements and contact you within 2 hours with a customized solution and proposal.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">In the meantime, you can visit our website at www.adlyncsolutions.com to see our portfolio and case studies.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Would you like to explore more services? Press 0 to return to our main menu, press 6 to book an immediate consultation, or press 9 to end this call.</Say>
  <Gather numDigits="1" action="/twilio/gather-response" method="POST" timeout="15">
    <Say voice="alice" language="en-US">Please press 0 for main menu, 6 for consultation, or 9 to end call.</Say>
  </Gather>
  <Say voice="alice" language="en-US">Thank you for choosing Adlync Solutions. Our team will contact you soon. Have a great day!</Say>
  <Hangup/>
</Response>`);
    } catch (error) {
      this.logger.error('❌ Error in recording complete webhook:', error);
      res.set('Content-Type', 'text/xml');
      res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">Thank you for your message. Our Adlync Solutions team will contact you soon. Goodbye!</Say>
  <Hangup/>
</Response>`);
    }
  }

  // Call Status Webhooks
  @Post('call-status')
  handleCallStatus(@Body() body: any, @Res() res: Response) {
    this.logger.log('Call status webhook', body);
    res.status(200).send('OK');
  }

  @Post('sms-status')
  handleSmsStatus(@Body() body: any, @Res() res: Response) {
    this.logger.log('SMS status webhook', body);
    res.status(200).send('OK');
  }

  @Post('whatsapp-status')
  handleWhatsAppStatus(@Body() body: any, @Res() res: Response) {
    this.logger.log('WhatsApp status webhook', body);
    res.status(200).send('OK');
  }

  @Post('incoming-sms')
  handleIncomingSms(@Body() body: any, @Res() res: Response) {
    this.logger.log('Incoming SMS webhook', body);
    res.set('Content-Type', 'text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Thank you for your message!</Message>
</Response>`);
  }

  @Post('incoming-whatsapp')
  async handleIncomingWhatsApp(@Body() body: any, @Res() res: Response) {
    this.logger.log('Incoming WhatsApp webhook', body);

    const from = body.From;
    const to = body.To;
    const messageBody = body.Body?.toLowerCase().trim();
    const messageSid = body.MessageSid;

    this.logger.log(`Incoming WhatsApp from ${from} to ${to}: ${messageBody}`);

    // AI Chatbot Logic - Use the comprehensive chatbot response
    let responseMessage = this.generateChatbotResponse(messageBody, from);

    this.logger.log(`🤖 Sending AI response: ${responseMessage.substring(0, 100)}...`);

    try {
      // Send WhatsApp message via Twilio API instead of TwiML
      const whatsappResponse = await this.twilioService.sendWhatsApp({
        from: to, // Reply from the Twilio WhatsApp number
        to: from, // Send to the user who messaged us
        body: responseMessage
      });

      this.logger.log(`✅ WhatsApp response sent successfully: ${whatsappResponse.data?.sid}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send WhatsApp response:`, error);
    }

    // Always return 200 OK to acknowledge webhook receipt
    res.status(200).send('OK');
  }

  // AI Chatbot Response Generator
  private generateChatbotResponse(message: string, from: string): string {
    // Extract phone number for personalization
    const phoneNumber = from.replace('whatsapp:', '');

    // Website Visitor Welcome Message
    if (
      message.includes('visited your website') ||
      message.includes('digital marketing services') ||
      message.includes('please share details') ||
      message.includes('would like to know more') ||
      message.includes('hello! i visited')
    ) {
      return `🚀 *Welcome to Adlync Solutions!*

Thank you for visiting our website! I'm your AI assistant ready to help.

*Our Digital Marketing Services:*

🎬 *AI Videos & Content Creation*
• AI Avatar Spokesperson Videos
• Product Demo Videos
• Social Media Content
• Starting from ₹5,000

📱 *Social Media Marketing*
• Instagram & Facebook Management
• Content Creation & Design
• Paid Advertising Campaigns
• Packages from ₹15,000/month

🎯 *Complete Digital Solutions*
• SEO & Google Ads
• Website Development
• Lead Generation Systems
• Custom packages from ₹25,000/month

*Quick Actions:*
• Type *"pricing"* for detailed pricing
• Type *"portfolio"* to see our work
• Type *"consultation"* for free strategy session
• Type *"services"* for complete service list

*For complete interactive menu with all options, just type* *"hi"*

*What specific service interests you most?*

Our team will respond within 5 minutes! 💬`;
    }

    // Main Menu Keywords
    if (
      !message ||
      message === 'hi' ||
      message === 'hii' ||
      message === 'hello' ||
      message === 'hey' ||
      message === 'start' ||
      message === 'menu' ||
      message.includes('hi')
    ) {
      return `Welcome to Adlync Solutions AI Assistant!

Hi there! I am here to help you with our digital marketing services.

Please choose an option:

1 - AI Videos and Avatar Videos
2 - Social Media Marketing
3 - Digital Marketing Solutions
4 - Our Portfolio and Case Studies
5 - Pricing and Packages
6 - Book Free Consultation
7 - Contact Information
8 - About Adlync Solutions

Just type the number (1-8) or keyword!

Type "menu" anytime to see options again.`;
    }

    // Option 1: AI Videos
    if (
      message === '1' ||
      message.includes('ai video') ||
      message.includes('avatar')
    ) {
      return `🎬 *AI Videos & Avatar Videos*

We create stunning AI-powered videos:

✨ *Our AI Video Services:*
• AI Avatar Spokesperson Videos
• AI-Generated Product Demos
• Personalized Video Messages
• Animated Explainer Videos
• AI Voice-over & Dubbing

🎯 *Benefits:*
• Cost-effective than traditional videos
• Quick turnaround (24-48 hours)
• Multiple languages support
• Unlimited revisions
• Professional quality

💰 *Starting from ₹5,000 per video*

*Want to see samples?* Type *"samples"*
*Ready to order?* Type *"order"*
*Back to menu?* Type *"menu"*`;
    }

    // Option 2: Social Media Marketing
    if (
      message === '2' ||
      message.includes('social media') ||
      message.includes('marketing')
    ) {
      return `📱 *Social Media Marketing*

Grow your business with our expert social media strategies:

🚀 *Our Services:*
• Instagram & Facebook Management
• Content Creation & Design
• Paid Advertising Campaigns
• Influencer Marketing
• Analytics & Reporting
• Community Management

📊 *What You Get:*
• 30 posts per month
• Daily story updates
• Targeted ad campaigns
• Monthly performance reports
• 24/7 support

💰 *Packages starting from ₹15,000/month*

*Want custom package?* Type *"custom"*
*See our work?* Type *"portfolio"*
*Back to menu?* Type *"menu"*`;
    }

    // Option 3: Digital Marketing
    if (
      message === '3' ||
      message.includes('digital marketing') ||
      message.includes('seo')
    ) {
      return `🚀 *Digital Marketing Solutions*

Complete digital transformation for your business:

🎯 *Our Expertise:*
• Search Engine Optimization (SEO)
• Google Ads & PPC Campaigns
• Website Development & Design
• Email Marketing Automation
• Brand Strategy & Development
• Lead Generation Systems

📈 *Results We Deliver:*
• 300% increase in website traffic
• 250% boost in lead generation
• 400% improvement in ROI
• Top Google rankings

💰 *Custom packages from ₹25,000/month*

*Free audit?* Type *"audit"*
*Case studies?* Type *"results"*
*Back to menu?* Type *"menu"*`;
    }

    // Option 4: Portfolio
    if (
      message === '4' ||
      message.includes('portfolio') ||
      message.includes('case studies') ||
      message === 'samples'
    ) {
      return `🏆 *Our Portfolio & Success Stories*

See how we've transformed businesses:

📊 *Recent Success Stories:*

*Case Study 1: E-commerce Brand*
• 500% increase in online sales
• 10x growth in social media followers
• ₹50L revenue in 6 months

*Case Study 2: Tech Startup*
• Generated 1000+ qualified leads
• Achieved #1 Google ranking
• 300% ROI on ad spend

*Case Study 3: Restaurant Chain*
• 200% increase in foot traffic
• Viral social media campaigns
• 15 new locations opened

🎬 *View Our Work:*
• AI Video Samples: bit.ly/adlync-videos
• Social Media: @adlyncsolutions
• Website Portfolio: adlyncsolutions.com

*Impressed?* Type *"consultation"*
*Back to menu?* Type *"menu"*`;
    }

    // Option 5: Pricing
    if (
      message === '5' ||
      message.includes('pricing') ||
      message.includes('cost') ||
      message.includes('price')
    ) {
      return `💰 *Pricing & Packages*

Transparent pricing for all budgets:

🎬 *AI Video Packages:*
• Basic: ₹5,000 (30-sec video)
• Standard: ₹10,000 (60-sec + revisions)
• Premium: ₹20,000 (Multiple videos)

📱 *Social Media Packages:*
• Starter: ₹15,000/month
• Growth: ₹25,000/month
• Enterprise: ₹50,000/month

🚀 *Digital Marketing:*
• SEO Package: ₹20,000/month
• Complete Solution: ₹40,000/month
• Custom Enterprise: ₹1,00,000+/month

🎁 *Special Offers:*
• 20% off first month
• Free consultation worth ₹5,000
• No setup fees

*Custom quote?* Type *"quote"*
*Ready to start?* Type *"order"*
*Back to menu?* Type *"menu"*`;
    }

    // Option 6: Book Consultation
    if (
      message === '6' ||
      message.includes('consultation') ||
      message.includes('book') ||
      message === 'quote'
    ) {
      return `📅 *Book Your FREE Consultation*

Get expert advice tailored to your business:

🎯 *What You'll Get:*
• 30-minute strategy session
• Business analysis & audit
• Custom marketing plan
• ROI projections
• No-obligation proposal

📞 *Book Now:*
• Call: +91-XXXX-XXXX-XXX
• Email: consultation@adlyncsolutions.com
• WhatsApp: Just reply "BOOK NOW"

⏰ *Available Slots:*
• Monday-Friday: 10 AM - 6 PM
• Saturday: 10 AM - 2 PM
• Emergency: 24/7 support

*Book immediately?* Type *"BOOK NOW"*
*Questions first?* Type *"questions"*
*Back to menu?* Type *"menu"*`;
    }

    // Option 7: Contact Information
    if (
      message === '7' ||
      message.includes('contact') ||
      message.includes('phone') ||
      message.includes('email')
    ) {
      return `📞 *Contact Adlync Solutions*

Get in touch with our team:

🏢 *Office Address:*
Adlync Solutions Pvt. Ltd.
123 Business Park, Sector 18
Gurgaon, Haryana 122001

📱 *Contact Details:*
• Phone: +91-XXXX-XXXX-XXX
• WhatsApp: +91-XXXX-XXXX-XXX
• Email: info@adlyncsolutions.com
• Website: www.adlyncsolutions.com

🕒 *Business Hours:*
• Monday-Friday: 9 AM - 7 PM
• Saturday: 10 AM - 4 PM
• Sunday: Emergency support only

🌐 *Follow Us:*
• Instagram: @adlyncsolutions
• LinkedIn: Adlync Solutions
• Facebook: AdlyncSolutions

*Emergency support?* Type *"urgent"*
*Back to menu?* Type *"menu"*`;
    }

    // Option 8: About Company
    if (
      message === '8' ||
      message.includes('about') ||
      message.includes('company')
    ) {
      return `🏢 *About Adlync Solutions*

Your trusted digital marketing partner:

🚀 *Our Story:*
Founded in 2020, we've helped 500+ businesses transform their digital presence with cutting-edge AI technology and proven marketing strategies.

👥 *Our Team:*
• 25+ Digital Marketing Experts
• AI Technology Specialists
• Creative Content Creators
• Data Analytics Professionals

🏆 *Achievements:*
• 500+ Successful Projects
• 300% Average ROI for clients
• 50+ Industry Awards
• 99% Client Satisfaction Rate

🎯 *Our Mission:*
To democratize digital marketing with AI-powered solutions that deliver measurable results for businesses of all sizes.

💡 *Why Choose Us:*
• Proven track record
• Latest AI technology
• Transparent reporting
• 24/7 support

*Join our success story?* Type *"start"*
*Back to menu?* Type *"menu"*`;
    }

    // Special Actions
    if (message === 'book now' || message === 'order') {
      return `🎉 *Excellent Choice!*

Our team will contact you within 2 hours to discuss your requirements.

📋 *Next Steps:*
1. Our expert will call you
2. Free consultation & strategy session
3. Custom proposal & timeline
4. Project kickoff

📞 *Immediate Assistance:*
Call us now: +91-XXXX-XXXX-XXX

*Urgent requirement?* Type *"urgent"*
*Change contact details?* Type *"contact"*

Thank you for choosing Adlync Solutions! 🚀`;
    }

    // Help and Support
    if (
      message.includes('help') ||
      message.includes('support') ||
      message === 'urgent'
    ) {
      return `🆘 *Need Help?*

Our support team is here for you:

📞 *Immediate Support:*
• Call: +91-XXXX-XXXX-XXX
• WhatsApp: This number
• Email: support@adlyncsolutions.com

❓ *Common Questions:*
• Pricing: Type *"5"*
• Services: Type *"menu"*
• Portfolio: Type *"4"*
• Consultation: Type *"6"*

🕒 *Response Time:*
• WhatsApp: Within 5 minutes
• Phone: Immediate
• Email: Within 2 hours

*Back to main menu?* Type *"menu"*`;
    }

    // Default response for unrecognized input
    return `🤖 I didn't quite understand that.

Here are some things you can try:

• Type *"menu"* for main options
• Type *"help"* for assistance
• Type *"contact"* for our details
• Use numbers 1-8 for specific services

Or simply tell me what you're looking for, and I'll help you find the right solution!

*What can I help you with today?* 🚀`;
  }

  // Health Check
  @Get('health')
  healthCheck(): { status: string; timestamp: string; service: string } {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Twilio Integration Service',
    };
  }
}
