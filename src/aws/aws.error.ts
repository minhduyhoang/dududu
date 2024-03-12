import { AWS_ERROR } from "src/utils/error/code.error";
import { ErrorResponse } from "../utils/interface/response.interface";

class AWSError extends ErrorResponse {
  private errorCode = AWS_ERROR.CODE;
  private fileName = AWS_ERROR.FILE;
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
}

export const AWSErrorMessage = new AWSError({});
