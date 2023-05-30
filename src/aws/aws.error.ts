import { AWS_ERROR_CODE } from '../utils/error/code.error';
import { ErrorResponse } from '../utils/interface/response.interface';

class AWSError extends ErrorResponse {
  private fileName = 'aws';
  constructor(error) {
    super(error);
  }

  uploadFailed() {
    return this.response(AWS_ERROR_CODE + 1, this.fileName);
  }

  deleteFailed() {
    return this.response(AWS_ERROR_CODE + 2, this.fileName);
  }

  onlyImagesAllowed() {
    return this.response(AWS_ERROR_CODE + 3, this.fileName);
  }
}

export const AWSErrorMessage = new AWSError({});
