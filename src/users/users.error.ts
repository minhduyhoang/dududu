import { USER_ERROR } from "src/utils/error/code.error";
import { ErrorResponse } from "../utils/interface/common.interface";

class UsersError extends ErrorResponse {
  private errorCode = USER_ERROR.CODE;
  private fileName = USER_ERROR.FILE;
  constructor(error) {
    super(error);
  }

  userNotFound(data?: any) {
    return this.response(this.errorCode + 1, this.fileName, true, data);
  }

  accountNotExist() {
    return this.response(this.errorCode + 2, this.fileName, true);
  }

  accountInActive() {
    return this.response(this.errorCode + 3, this.fileName, true);
  }

  incorrectPassword() {
    return this.response(this.errorCode + 4, this.fileName, true);
  }

  emailAlreadyExist() {
    return this.response(this.errorCode + 5, this.fileName, true);
  }

  phoneNumberAlreadyExist() {
    return this.response(this.errorCode + 6, this.fileName, true);
  }
}

export const UsersErrorMessage = new UsersError({});
