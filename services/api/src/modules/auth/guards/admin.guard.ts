import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const ADMIN_USER_TYPES = ['Admin', 'Super Admin'];

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as { userType?: string } | undefined;
    const userType = user?.userType;
    if (!userType || !ADMIN_USER_TYPES.includes(userType)) {
      throw new ForbiddenException('Admin access required');
    }
    return true;
  }
}
