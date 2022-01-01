import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(email: string, password: string) {
    const users = await this.usersService.find(email);

    if (!users?.length) {
      throw new BadRequestException('User not found');
    }

    const [user] = users;
    const [salt, hashedPassword] = user.password.split('.');
    const hashedAttempt = (await scrypt(password, salt, 32)) as Buffer;

    if (hashedPassword !== hashedAttempt.toString('hex')) {
      throw new BadRequestException('Invalid password');
    }

    return user;
  }

  async signUp(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users?.length) {
      throw new BadRequestException('User already exists');
    }

    const salt = randomBytes(16).toString('hex');
    const hashedPassword = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hashedPassword.toString('hex');

    return this.usersService.create(email, result);
  }
}
