import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class CustomMailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTestEmail(): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: 'test@example.com',
        subject: 'Test Email from NestJS',
        html: '<h1>Hello!</h1><p>This is a test email.</p>',
      });
      return true;
    } catch (error) {
      console.error('Error sending test email:', error);
      return false;
    }
  }

  // Simple method to send welcome email
  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: userEmail,
        subject: 'Welcome to Our Platform!',
        template: 'welcome',
        context: {
          name: userName,
          username: userName.toLowerCase().replace(' ', ''),
          email: userEmail,
          loginUrl: 'http://localhost:3333/login',
        },
      });
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  // Simple method to send verification email
  async sendVerificationEmail(userEmail: string, userName: string, code: string): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: userEmail,
        subject: 'Verify Your Email',
        template: 'verification',
        context: {
          name: userName,
          email: userEmail,
          verificationCode: code,
          verificationUrl: `http://localhost:3333/verify?code=${code}`,
        },
      });
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      return false;
    }
  }

  // Simple method to send any email with template
  async sendEmailWithTemplate(
    userEmail: string, 
    emailSubject: string, 
    templateName: string, 
    templateData: any
  ): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: userEmail,
        subject: emailSubject,
        template: templateName,
        context: templateData,
      });
      return true;
    } catch (error) {
      console.error('Error sending email with template:', error);
      return false;
    }
  }
}
