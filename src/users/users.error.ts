import { USER_ERROR } from 'src/utils/error/code.error';
import { ErrorResponse } from '../utils/interface/common.interface';

class UsersError extends ErrorResponse {
  constructor(error) {
    super(error);
  }

  userNotFound(data?: any) {
    return this.response(USER_ERROR.CODE + 1, USER_ERROR.FILE, data);
  }

  accountNotExist() {
    return this.response(USER_ERROR.CODE + 2, USER_ERROR.FILE);
  }

  accountInActive() {
    return this.response(USER_ERROR.CODE + 3, USER_ERROR.FILE);
  }

  incorrectPassword() {
    return this.response(USER_ERROR.CODE + 4, USER_ERROR.FILE);
  }

  emailAlreadyExist() {
    return this.response(USER_ERROR.CODE + 5, USER_ERROR.FILE);
  }

  phoneNumberAlreadyExist() {
    return this.response(USER_ERROR.CODE + 6, USER_ERROR.FILE);
  }

}

export const UsersErrorMessage = new UsersError({});
