import { applyDecorators, UseGuards } from '@nestjs/common';
import { USER_ROLE } from 'src/users/users.constant';
import { SetMetadata } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/role.guard';

export function Auth(role?: USER_ROLE | USER_ROLE[]) {
  let roles = role;
  if (typeof role === 'string') roles = [role];
  return applyDecorators(SetMetadata('roles', roles), UseGuards(JwtAuthGuard, RolesGuard));
}
