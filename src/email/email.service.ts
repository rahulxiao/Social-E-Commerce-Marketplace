import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome! Please confirm your email',
      template: './confirmation', // if you use templates
      context: {
        token,
      },
    });
  }
}