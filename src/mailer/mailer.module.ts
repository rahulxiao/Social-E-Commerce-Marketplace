import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './mailer.config';
import { CustomMailerService } from './mailer.service';
import { MailerController } from './mailer.controller';

@Module({
  imports: [
    MailerModule.forRoot(mailerConfig),
  ],
  controllers: [MailerController],
  providers: [CustomMailerService],
  exports: [CustomMailerService],
})
export class CustomMailerModule {}
