import { AWS_ERROR_CODE } from '../utils/error/code.error';
import { ErrorResponse } from '../utils/interface/response.interface';

class AWSError extends ErrorResponse {
  constructor(error) {
    super(error);
  }

  uploadFailed() {
    return this.response(AWS_ERROR_CODE + 1, 'aws');
  }

  deleteFailed() {
    return this.response(AWS_ERROR_CODE + 2, 'aws');
  }

  onlyImagesAllowed() {
    return this.response(AWS_ERROR_CODE + 3, 'aws');
  }
}

export const AWSErrorMessage = new AWSError({});
