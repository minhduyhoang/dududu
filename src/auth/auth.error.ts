import { AUTH_ERROR } from 'src/utils/error/code.error';
import { ErrorResponse } from '../utils/interface/common.interface';

class AuthError extends ErrorResponse {
  constructor(error) {
    super(error);
  }

  sessionExpired() {
    return this.response(AUTH_ERROR.CODE + 1, AUTH_ERROR.FILE);
  }

  invalidAccessToken() {
    return this.response(AUTH_ERROR.CODE + 2, AUTH_ERROR.FILE);
  }

  invalidRefreshToken() {
    return this.response(AUTH_ERROR.CODE + 3, AUTH_ERROR.FILE);
  }

  unauthorized() {
    return this.response(AUTH_ERROR.CODE + 4, AUTH_ERROR.FILE);
  }

  forbidden() {
    return this.response(AUTH_ERROR.CODE + 5, AUTH_ERROR.FILE);
  }
}

export const AuthErrorMessage = new AuthError({});
