import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { UsersService } from '../users.service';
import { User } from '../user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(request: Request, _: Response, next: NextFunction) {
    const { userId } = request.session || {};

    if (!userId) {
      return next();
    }

    const user = await this.usersService.findOne(userId);

    if (!user) {
      return next();
    }

    request.currentUser = user;

    next();
  }
}
