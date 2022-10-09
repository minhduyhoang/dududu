import { COMMON_ERROR_CODE } from 'src/utils/error/code.error';
import { ErrorResponse } from '../interface/response.interface';

class CommonError extends ErrorResponse {
  constructor(error) {
    super(error);
  }

  timeInvalid() {
    return this.response(COMMON_ERROR_CODE + 1, 'common');
  }
}

export const CommonErrorMessage = new CommonError({});
