import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { Language } from '../constant/language.constant';
import { IErrorResponse } from '../interface/common.interface';

@Catch(HttpException)
export class AnyExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n?: I18nService) {}
  async catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = host.switchToHttp().getResponse();
    const request: any = host.switchToHttp().getRequest();
    const reqUser = request.user;

    const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;
    const lang = reqUser?.language || ctx.getRequest().i18nLang || Language.En;

    const code = error?.response?.code || '000';
    const file = error?.response?.file || 'common';
    const data = error?.response?.data || {};

    if (code === '000' && file === 'common') {
      message = error?.sqlMessage || error?.response?.message || JSON.stringify(error?.response) || JSON.stringify(error);
      if (Array.isArray(message)) {
        message = message.join(', ');
      }
    } else {
      message = await this.i18n.translate(`${file}.${code}`, {
        lang: lang,
        args: data
      });
    }

    const errorResponse: IErrorResponse = {
      code: error?.response?.code || '000',
      message:
        message ||
        (await this.i18n.translate(`${file}.${code}`, {
          lang: lang,
          args: data
        })),
    };
    response.status(status).json({ error: errorResponse });
  }
}
