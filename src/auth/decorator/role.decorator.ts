import { SetMetadata } from '@nestjs/common';
import { USER_ROLE } from 'src/users/users.constant';

export const AuthRoles = (...roles: USER_ROLE[]) => SetMetadata('roles', roles);
