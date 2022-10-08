import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from '../../utils/interface/common.interface';
import { AuthErrorMessage } from '../auth.error';

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard('jwt-refresh-token') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest(err, user, info) {
    if (err || !user) {
      throw Response.unauthorized(AuthErrorMessage.unauthorized());
    }
    return user;
  }
}
