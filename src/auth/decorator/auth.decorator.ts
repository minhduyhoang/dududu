import { applyDecorators } from '@nestjs/common';
import { AuthRoles } from 'src/auth/decorator/role.decorator';
import { USER_ROLE } from 'src/users/users.constant';

export function Auth(role?: USER_ROLE | USER_ROLE[]) {
  let roles = [];
  if (typeof role === 'string') roles = [role];
  else roles = role;
  return applyDecorators(AuthRoles(...roles));
}
