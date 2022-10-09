import { USER_ERROR_CODE } from 'src/utils/error/code.error';
import { ErrorResponse } from '../utils/interface/common.interface';

class UsersError extends ErrorResponse {
  constructor(error) {
    super(error);
  }

  userNotFound(data?: any) {
    return this.response(USER_ERROR_CODE + 1, 'user', data);
  }

  accountNotExist() {
    return this.response(USER_ERROR_CODE + 2, 'user');
  }

  accountInActive() {
    return this.response(USER_ERROR_CODE + 3, 'user');
  }

  incorrectPassword() {
    return this.response(USER_ERROR_CODE + 4, 'user');
  }

  emailAlreadyExist() {
    return this.response(USER_ERROR_CODE + 5, 'user');
  }

  phoneNumberAlreadyExist() {
    return this.response(USER_ERROR_CODE + 6, 'user');
  }
}

export const UsersErrorMessage = new UsersError({});
