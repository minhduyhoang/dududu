import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailSubject, MailTemplate } from './mail.constant';

@Injectable()
export class MailService {
  private mailFrom: string;
  private mailTo: string;

  constructor(private configService: ConfigService, private mailerService: MailerService) {
    this.mailFrom = this.configService.get<string>('MAIL_FROM');
    this.mailTo = this.configService.get<string>('MAIL_ADMIN');
  }

  async sendEmailContact(dataSend: any): Promise<void> {
    try {
      const CONTENT = dataSend.content;

      await this.mailerService.sendMail({
        to: this.mailTo,
        from: this.mailFrom,
        subject: MailSubject.AAAA,
        template: MailTemplate.Common,
        context: { CONTENT },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
