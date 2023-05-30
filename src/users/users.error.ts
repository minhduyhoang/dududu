import { USER_ERROR_CODE } from 'src/utils/error/code.error';
import { ErrorResponse } from '../utils/interface/common.interface';

class UsersError extends ErrorResponse {
  private fileName = 'user';
  constructor(error) {
    super(error);
  }

  userNotFound(data?: any) {
    return this.response(USER_ERROR_CODE + 1, this.fileName, data);
  }

  accountNotExist() {
    return this.response(USER_ERROR_CODE + 2, this.fileName);
  }

  accountInActive() {
    return this.response(USER_ERROR_CODE + 3, this.fileName);
  }

  incorrectPassword() {
    return this.response(USER_ERROR_CODE + 4, this.fileName);
  }

  emailAlreadyExist() {
    return this.response(USER_ERROR_CODE + 5, this.fileName);
  }

  phoneNumberAlreadyExist() {
    return this.response(USER_ERROR_CODE + 6, this.fileName);
  }
}

export const UsersErrorMessage = new UsersError({});
