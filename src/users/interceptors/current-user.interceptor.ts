import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';

import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request?.session || {};

    if (!userId) {
      return next.handle();
    }

    const user = await this.usersService.findOne(userId);

    if (!user) {
      return next.handle();
    }

    request.currentUser = user;

    return next.handle();
  }
}
