import { AUTH_ERROR_CODE } from 'src/utils/error/code.error';
import { ErrorResponse } from '../utils/interface/common.interface';

class AuthError extends ErrorResponse {
  private fileName = 'auth';
  constructor(error) {
    super(error);
  }

  sessionExpired() {
    return this.response(AUTH_ERROR_CODE + 1, this.fileName);
  }

  invalidAccessToken() {
    return this.response(AUTH_ERROR_CODE + 2, this.fileName);
  }

  invalidRefreshToken() {
    return this.response(AUTH_ERROR_CODE + 3, this.fileName);
  }

  unauthorized() {
    return this.response(AUTH_ERROR_CODE + 4, this.fileName);
  }

  forbidden() {
    return this.response(AUTH_ERROR_CODE + 5, this.fileName);
  }
}

export const AuthErrorMessage = new AuthError({});
