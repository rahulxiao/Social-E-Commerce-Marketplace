/*
import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  sendEmail(@Body() body: { to: string; subject: string; text: string }) {
    return this.emailService.sendEmail(body.to, body.subject, body.text);
  }
}
  */
