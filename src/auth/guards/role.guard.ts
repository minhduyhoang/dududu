import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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

    const isAuthorized = roles.includes(user.role);

    if (!isAuthorized) {
      throw Response.forbidden(AuthErrorMessage.forbidden());
    }

    return true;
  }
}
