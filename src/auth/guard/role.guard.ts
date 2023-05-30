import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_ROLE } from 'src/users/users.constant';
import { IRequest } from '../../utils/interface/common.interface';

import { Response } from '../../utils/interface/common.interface';
import { AuthErrorMessage } from '../auth.error';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    let roles: any = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request: IRequest = context.switchToHttp().getRequest();

    const user = request.user;
    if (!user) {
      throw Response.unauthorized(AuthErrorMessage.unauthorized());
    }

    if (roles.includes(USER_ROLE.ANY)) {
      return true;
    }

    const isAuthorized = roles.includes(user.role);

    if (!isAuthorized) {
      throw Response.forbidden(AuthErrorMessage.forbidden());
    }

    return true;
  }
}
