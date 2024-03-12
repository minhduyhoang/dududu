import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { I18nService } from "nestjs-i18n";

import { LANGUAGE } from "../constant/constant";
import { IErrorResponse } from "../interface/common.interface";
import * as moment from "moment-timezone";
import * as fs from "fs";
import { EntityNotFoundError, QueryFailedError, TypeORMError } from "typeorm";

const dir = "src/logs";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
function writeLogs(error: any) {
  const time = moment().tz("Asia/Seoul").format("yyyy-MM-DD");
  const logFile = fs.createWriteStream(dir + "/log_" + time + ".txt", {
    flags: "a",
  });
  logFile.write(
    `${moment().tz("Asia/Seoul").format("yyyy-MM-DD HH:mm:ss")} - ${JSON.stringify(error)}\n`,
  );
  logFile.write(`\n`);
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly i18n?: I18nService) {}
  async catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = host.switchToHttp().getResponse();
    const request: any = host.switchToHttp().getRequest();
    const reqUser = request.user;

    if (error?.status !== 401 && error?.status !== 403) {
      writeLogs(error);
    }
    const status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;
    const lang = reqUser?.language || ctx.getRequest().i18nLang || LANGUAGE.EN;

    const code = error?.response?.code || "000";
    const file = error?.response?.file || "common";
    const data = error?.response?.data || {};

    if (code === "000" && file === "common") {
      message =
        error?.sqlMessage ||
        error?.response?.message ||
        error.message ||
        JSON.stringify(error?.response) ||
        JSON.stringify(error);
      if (Array.isArray(message)) {
        message = message.join(", ");
      }
    } else {
      message = await this.i18n.translate(`${file}.${code}`, {
        lang: lang,
        args: data,
      });
    }

    const errorResponse: IErrorResponse = {
      code: error?.response?.code || "000",
      message:
        message ||
        (await this.i18n.translate(`${file}.${code}`, {
          lang: lang,
          args: data,
        })),
    };
    response.status(status).json({ error: errorResponse });
  }
}
