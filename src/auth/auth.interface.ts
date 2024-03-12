import { USER_ROLE } from "src/users/users.constant";

export enum ETokenType {
  access = "ACCESS",
  refresh = "REFRESH",
}

export interface IToken {
  userId: number;
  sessionId: number;
  role: USER_ROLE;
  tokenType: ETokenType;
}

export interface IVerifyInfo {
  socialId: string;
  email: string;
}
