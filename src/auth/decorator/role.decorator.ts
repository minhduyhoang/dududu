import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/users.constant';

export const AuthRoles = (...roles: UserRole[]) => SetMetadata('roles', roles);
