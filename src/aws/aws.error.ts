import { AWS_ERROR } from '../utils/error/code.error';
import { ErrorResponse } from '../utils/interface/response.interface';

class AWSError extends ErrorResponse {
  constructor(error) {
    super(error);
  }

  uploadFailed() {
    return this.response(AWS_ERROR.CODE + 1, AWS_ERROR.FILE);
  }

  deleteFailed() {
    return this.response(AWS_ERROR.CODE + 2, AWS_ERROR.FILE);
  }

  onlyImagesAllowed() {
    return this.response(AWS_ERROR.CODE + 3, AWS_ERROR.FILE);
  }
}

export const AWSErrorMessage = new AWSError({});
