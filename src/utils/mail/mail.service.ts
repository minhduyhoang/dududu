import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailSubject, MailTemplate } from "./mail.constant";

@Injectable()
export class MailService {
  private mailFrom: string;
  private mailTo: string;

  constructor(
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {
    this.mailFrom = this.configService.get<string>("MAIL_FROM");
    this.mailTo = this.configService.get<string>("MAIL_ADMIN");
  }

  async sendEmailContact(
    template: MailTemplate,
    to: string,
    subject: MailSubject,
    context: any,
    attachments?: any,
  ): Promise<void> {
    try {
      this.mailerService.sendMail({
        to,
        from: this.mailFrom,
        subject,
        template,
        context,
        attachments,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
