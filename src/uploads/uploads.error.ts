import { ErrorResponse } from '../utils/interface/response.interface';

class UploadsError extends ErrorResponse {
  private fileName = 'upload';
  constructor(error) {
    super(error);
  }

  uploadFailed() {
    return this.response('501', this.fileName, true);
  }

  deleteFailed() {
    return this.response('502', this.fileName, true);
  }

  onlyImagesAllowed() {
    return this.response('503', this.fileName, true);
  }

  fileUploadIsEmpty() {
    return this.response('505', this.fileName, true);
  }

  notFound() {
    return this.response('506', this.fileName, true);
  }
}

export const UploadsErrorMessage = new UploadsError({});
