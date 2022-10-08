import { applyDecorators } from '@nestjs/common';
import { AuthRoles } from 'src/auth/decorator/role.decorator';
import { UserRole } from 'src/users/users.constant';

export function Auth(role?: UserRole | UserRole[]) {
  let roles = [];
  if (typeof role === 'string') roles = [role];
  else roles = role;
  return applyDecorators(AuthRoles(...roles));
}
