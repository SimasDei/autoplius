import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(
      '🚀 ~ file: auth.guard.ts ~ line 6 ~ AuthGuard ~ canActivate ~ request',
      request,
    );
    const user = request.session.userId;
    return Boolean(user);
  }
}
