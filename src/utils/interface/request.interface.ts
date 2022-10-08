import { UserRole } from 'src/users/users.constant';
import { Language } from '../constant/language.constant';

export interface IReqUser {
  userId: number;
  sessionId: number;
  role: UserRole;
  language: Language;
}

export interface IRequest {
  user: IReqUser;
}
