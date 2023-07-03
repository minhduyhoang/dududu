import { ErrorResponse } from '../utils/interface/response.interface';

class AWSError extends ErrorResponse {
  private fileName = 'aws';
  constructor(error) {
    super(error);
  }

  uploadFailed() {
    return this.response('401', this.fileName, true);
  }

  deleteFailed() {
    return this.response('402', this.fileName, true);
  }

  onlyImagesAllowed() {
    return this.response('403', this.fileName, true);
  }
}

export const AWSErrorMessage = new AWSError({});
