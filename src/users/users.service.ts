import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async findOne(id: number) {
    const user = await this.repo.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async find(email: string) {
    const users = await this.repo.find({ email });

    if (!users.length) {
      return null;
    }

    return users;
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.repo.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, attrs);

    await this.repo.update(id, user);

    return user;
  }

  async delete(id: number) {
    const user = await this.repo.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repo.delete(id);
  }
}
