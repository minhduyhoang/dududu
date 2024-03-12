import { ErrorResponse } from "../utils/interface/common.interface";

class SessionsError extends ErrorResponse {
  constructor(error) {
    super(error);
  }
}

export const SessionsErrorMessage = new SessionsError({});
