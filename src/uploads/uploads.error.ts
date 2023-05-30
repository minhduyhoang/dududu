import { UPLOAD_ERROR_CODE } from '../utils/error/code.error';
import { ErrorResponse } from '../utils/interface/response.interface';

class UploadsError extends ErrorResponse {
  private fileName = 'upload';
  constructor(error) {
    super(error);
  }

  uploadFailed() {
    return this.response(UPLOAD_ERROR_CODE + 1, this.fileName);
  }

  deleteFailed() {
    return this.response(UPLOAD_ERROR_CODE + 2, this.fileName);
  }

  onlyImagesAllowed() {
    return this.response(UPLOAD_ERROR_CODE + 3, this.fileName);
  }

  fileUploadIsEmpty() {
    return this.response(UPLOAD_ERROR_CODE + 5, this.fileName);
  }

  notFound() {
    return this.response(UPLOAD_ERROR_CODE + 6, this.fileName);
  }
}

export const UploadsErrorMessage = new UploadsError({});
