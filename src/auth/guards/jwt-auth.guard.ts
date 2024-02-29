import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'src/utils/interface/response.interface';
import { AuthErrorMessage } from '../auth.error';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest(err, user, info) {
    //Invalid or missing JWT
    if (err || !user) {
      return null;
    }
    return user;
  }
}
