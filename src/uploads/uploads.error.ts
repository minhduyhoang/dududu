import { UPLOAD_ERROR } from "src/utils/error/code.error";
import { ErrorResponse } from "../utils/interface/response.interface";

class UploadsError extends ErrorResponse {
  private errorCode = UPLOAD_ERROR.CODE;
  private fileName = UPLOAD_ERROR.FILE;
  constructor(error) {
    super(error);
  }

  uploadFailed() {
    return this.response(this.errorCode + 1, this.fileName, true);
  }

  deleteFailed() {
    return this.response(this.errorCode + 2, this.fileName, true);
  }

  onlyImagesAllowed() {
    return this.response(this.errorCode + 3, this.fileName, true);
  }

  fileUploadIsEmpty() {
    return this.response(this.errorCode + 4, this.fileName, true);
  }

  notFound() {
    return this.response(this.errorCode + 5, this.fileName, true);
  }
}

export const UploadsErrorMessage = new UploadsError({});
