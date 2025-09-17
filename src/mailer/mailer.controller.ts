import { Controller, Post, Body, Get, HttpStatus, HttpException } from '@nestjs/common';
import { CustomMailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: CustomMailerService) {}

  @Post('test')
  async sendTestEmail() {
    try {
      const result = await this.mailerService.sendTestEmail();
      if (result) {
        return {
          success: true,
          message: 'Test email sent successfully',
          timestamp: new Date().toISOString(),
        };
      } else {
        throw new HttpException('Failed to send test email', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      throw new HttpException(
        `Error sending test email: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('welcome')
  async sendWelcomeEmail(@Body() data: { email: string; name: string }) {
    try {
      const result = await this.mailerService.sendWelcomeEmail(data.email, data.name);
      if (result) {
        return {
          success: true,
          message: 'Welcome email sent successfully',
          data: {
            to: data.email,
            name: data.name,
          },
          timestamp: new Date().toISOString(),
        };
      } else {
        throw new HttpException('Failed to send welcome email', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      throw new HttpException(
        `Error sending welcome email: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('verification')
  async sendVerificationEmail(@Body() data: { email: string; name: string; code: string }) {
    try {
      const result = await this.mailerService.sendVerificationEmail(data.email, data.name, data.code);
      if (result) {
        return {
          success: true,
          message: 'Verification email sent successfully',
          data: {
            to: data.email,
            name: data.name,
            code: data.code,
          },
          timestamp: new Date().toISOString(),
        };
      } else {
        throw new HttpException('Failed to send verification email', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      throw new HttpException(
        `Error sending verification email: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('template')
  async sendEmailWithTemplate(@Body() data: { 
    email: string; 
    subject: string; 
    template: string; 
    templateData: any 
  }) {
    try {
      const result = await this.mailerService.sendEmailWithTemplate(
        data.email, 
        data.subject, 
        data.template, 
        data.templateData
      );
      if (result) {
        return {
          success: true,
          message: 'Email sent successfully',
          data: {
            to: data.email,
            subject: data.subject,
            template: data.template,
          },
          timestamp: new Date().toISOString(),
        };
      } else {
        throw new HttpException('Failed to send email', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      throw new HttpException(
        `Error sending email: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  async healthCheck() {
    return {
      success: true,
      message: 'Mailer service is healthy',
      timestamp: new Date().toISOString(),
      service: 'NestJS Mailer',
      version: '1.0.0',
    };
  }
}
