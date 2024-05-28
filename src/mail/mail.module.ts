import "dotenv/config.js";
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports : [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
           user: "",
          pass:process.env.MAIL_PASSWORD
        },
        secure : false
      },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
     
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports : [MailService]
})
export class MailModule {}
