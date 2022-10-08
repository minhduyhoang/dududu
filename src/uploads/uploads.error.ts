import { UPLOAD_ERROR } from '../utils/error/code.error';
import { ErrorResponse } from '../utils/interface/response.interface';

class UploadsError extends ErrorResponse {
  constructor(error) {
    super(error);
  }

  uploadFailed() {
    return this.response(UPLOAD_ERROR.CODE + 1, UPLOAD_ERROR.FILE);
  }

  deleteFailed() {
    return this.response(UPLOAD_ERROR.CODE + 2, UPLOAD_ERROR.FILE);
  }

  onlyImagesAllowed() {
    return this.response(UPLOAD_ERROR.CODE + 3, UPLOAD_ERROR.FILE);
  }

  fileUploadIsEmpty() {
    return this.response(UPLOAD_ERROR.CODE + 5, UPLOAD_ERROR.FILE);
  }

  notFound() {
    return this.response(UPLOAD_ERROR.CODE + 6, UPLOAD_ERROR.FILE);
  }
}

export const UploadsErrorMessage = new UploadsError({});
