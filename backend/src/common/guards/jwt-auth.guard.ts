import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Explicit no-arg constructor so Nest has no DI dependencies to resolve.
  // Without it, the guard inherits `AuthModuleOptions` from AuthGuard's mixin
  // metadata and every module using @UseGuards(JwtAuthGuard) must import PassportModule.
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required to access this resource.');
    }
    return user;
  }
}
