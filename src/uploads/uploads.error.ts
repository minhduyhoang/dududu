import { UPLOAD_ERROR_CODE } from '../utils/error/code.error';
import { ErrorResponse } from '../utils/interface/response.interface';

class UploadsError extends ErrorResponse {
  constructor(error) {
    super(error);
  }

  uploadFailed() {
    return this.response(UPLOAD_ERROR_CODE + 1, 'upload');
  }

  deleteFailed() {
    return this.response(UPLOAD_ERROR_CODE + 2, 'upload');
  }

  onlyImagesAllowed() {
    return this.response(UPLOAD_ERROR_CODE + 3, 'upload');
  }

  fileUploadIsEmpty() {
    return this.response(UPLOAD_ERROR_CODE + 5, 'upload');
  }

  notFound() {
    return this.response(UPLOAD_ERROR_CODE + 6, 'upload');
  }
}

export const UploadsErrorMessage = new UploadsError({});
