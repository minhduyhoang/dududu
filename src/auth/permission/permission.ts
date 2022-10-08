import { UserRole } from "src/users/users.constant";

export const SUPER_ADMIN_PERMISSION = [UserRole.SuperAdmin];

export const ADMIN_PERMISSION = [UserRole.Admin, UserRole.SuperAdmin];

export const ANY_PERMISSION = [UserRole.Any];
