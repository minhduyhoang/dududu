import { ErrorResponse } from '../interface/response.interface';

class CommonError extends ErrorResponse {
  constructor(error) {
    super(error);
  }

  timeInvalid() {
    return this.response('001', 'common', true);
  }
}

export const CommonErrorMessage = new CommonError({});
