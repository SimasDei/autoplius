import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    const createdUser = await this.repo.save(user);

    Object.defineProperty(createdUser, 'password', {
      value: undefined,
      writable: false,
      configurable: false,
    });

    return createdUser;
  }
}
