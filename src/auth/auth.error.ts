import { AUTH_ERROR_CODE } from 'src/utils/error/code.error';
import { ErrorResponse } from '../utils/interface/common.interface';

class AuthError extends ErrorResponse {
  constructor(error) {
    super(error);
  }

  sessionExpired() {
    return this.response(AUTH_ERROR_CODE + 1, 'auth');
  }

  invalidAccessToken() {
    return this.response(AUTH_ERROR_CODE + 2, 'auth');
  }

  invalidRefreshToken() {
    return this.response(AUTH_ERROR_CODE + 3, 'auth');
  }

  unauthorized() {
    return this.response(AUTH_ERROR_CODE + 4, 'auth');
  }

  forbidden() {
    return this.response(AUTH_ERROR_CODE + 5, 'auth');
  }
}

export const AuthErrorMessage = new AuthError({});
