import { USER_ROLE } from 'src/users/users.constant';
import { LANGUAGE } from '../constant/constant';

export interface IReqUser {
  userId: number;
  sessionId: number;
  role: USER_ROLE;
  language: LANGUAGE;
}

export interface IRequest {
  user: IReqUser;
}
