import { ErrorResponse } from '../utils/interface/common.interface';

class AuthError extends ErrorResponse {
  private fileName = 'auth';
  constructor(error) {
    super(error);
  }

  sessionExpired() {
    return this.response('201', this.fileName, true);
  }

  invalidAccessToken() {
    return this.response('202', this.fileName, true);
  }

  invalidRefreshToken() {
    return this.response('203', this.fileName, true);
  }

  unauthorized() {
    return this.response('204', this.fileName, true);
  }

  forbidden() {
    return this.response('205', this.fileName, true);
  }
}

export const AuthErrorMessage = new AuthError({});
