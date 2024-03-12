import { AWS_ERROR } from "src/utils/error/code.error";
import { ErrorResponse } from "../utils/interface/common.interface";

class AuthError extends ErrorResponse {
  private errorCode = AWS_ERROR.CODE;
  private fileName = AWS_ERROR.FILE;
  constructor(error) {
    super(error);
  }

  sessionExpired() {
    return this.response(this.errorCode + 1, this.fileName, true);
  }

  invalidAccessToken() {
    return this.response(this.errorCode + 2, this.fileName, true);
  }

  invalidRefreshToken() {
    return this.response(this.errorCode + 3, this.fileName, true);
  }

  unauthorized() {
    return this.response(this.errorCode + 4, this.fileName, true);
  }

  forbidden() {
    return this.response(this.errorCode + 5, this.fileName, true);
  }
}

export const AuthErrorMessage = new AuthError({});
