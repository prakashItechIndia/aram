import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser>(err: Error | null, user: TUser | false): TUser {
    if (err) {
      throw new UnauthorizedException(
        err.message === 'jwt expired'
          ? 'Token expired. Please log in again.'
          : 'Token invalid. Please log in again.',
      );
    }
    if (!user) {
      throw new UnauthorizedException('Token missing or invalid. Please log in again.');
    }
    return user;
  }
}
