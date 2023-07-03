import { ErrorResponse } from '../utils/interface/common.interface';

class UsersError extends ErrorResponse {
  private fileName = 'user';
  constructor(error) {
    super(error);
  }

  userNotFound(data?: any) {
    return this.response('101', this.fileName, true, data);
  }

  accountNotExist() {
    return this.response('102', this.fileName, true);
  }

  accountInActive() {
    return this.response('103', this.fileName, true);
  }

  incorrectPassword() {
    return this.response('104', this.fileName, true);
  }

  emailAlreadyExist() {
    return this.response('105', this.fileName, true);
  }

  phoneNumberAlreadyExist() {
    return this.response('106', this.fileName, true);
  }
}

export const UsersErrorMessage = new UsersError({});
