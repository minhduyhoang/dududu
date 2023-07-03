export interface ISuccessResponse {
  data: any;
}

import { BadRequestException, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
export interface IErrorResponse {
  code: string;
  message: string;
  data?: any;
}

export interface FilterErrorResponse {
  code: string;
  file: string;
  isShow: boolean;
  data?: any;
}

export class ErrorResponse {
  code: string;
  file: string;
  isShow: boolean;
  data: any;
  constructor(error: FilterErrorResponse) {
    this.code = error.code;
    this.file = error.file;
    this.isShow = error.isShow;
    this.data = error.data || {};
  }

  response(code: string, file: string, isShow: boolean, data?: any) {
    this.code = code;
    this.file = file;
    this.isShow = isShow;
    this.data = data;
    return this;
  }
}

class ResponseC {
  public success(data: any = {}): ISuccessResponse {
    return { data };
  }
  public error(data: ErrorResponse): BadRequestException {
    return new BadRequestException(data);
  }
  public unauthorized(data: ErrorResponse): UnauthorizedException {
    return new UnauthorizedException(data);
  }
  public forbidden(data: ErrorResponse): ForbiddenException {
    return new ForbiddenException(data);
  }
  public notfound(data: ErrorResponse): NotFoundException {
    return new NotFoundException(data);
  }
}

export const Response = new ResponseC();
