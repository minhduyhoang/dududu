import { ErrorResponse } from "../interface/response.interface";
import { COMMON_ERROR } from "./code.error";

class CommonError extends ErrorResponse {
  private errorCode = COMMON_ERROR.CODE;
  private fileName = COMMON_ERROR.FILE;
  constructor(error) {
    super(error);
  }

  timeInvalid() {
    return this.response(this.errorCode + 1, this.fileName, true);
  }

  callTooFast() {
    return this.response(this.errorCode + 2, this.fileName, true);
  }
}

export const CommonErrorMessage = new CommonError({});
