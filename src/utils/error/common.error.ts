import { COMMON_ERROR } from 'src/utils/error/code.error';
import { ErrorResponse } from '../interface/response.interface';

class CommonError extends ErrorResponse {
  constructor(error) {
    super(error);
  }

  timeInvalid() {
    return this.response(COMMON_ERROR.CODE + 1, COMMON_ERROR.FILE);
  }
}

export const CommonErrorMessage = new CommonError({});
