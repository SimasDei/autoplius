import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AuthService } from '../auth.service';
import { User } from '../user.entity';
import { UsersService } from '../users.service';

describe('Auth service test suite', () => {
  const users: User[] = [];
  let service: AuthService;
  let usersServiceMock: Partial<UsersService>;

  beforeEach(async () => {
    usersServiceMock = {
      find: (email: string) =>
        Promise.resolve(users.filter((user) => user.email === email)),
      create: (email: string, password: string) => {
        const user = {
          id: users.length + 1,
          email,
          password,
        } as User;

        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('should create instance of the auth service', async () => {
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(AuthService);
  });

  it('should create a new user with hashed psw and return it', async () => {
    const mockUser = {
      email: 'test@test.com',
      password: 'test',
    };
    const user = await service.signUp(mockUser.email, mockUser.password);

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();

    expect(user.password).not.toEqual(mockUser.password);
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should throw an error if user tries to sign up with an already in use email', async () => {
    const mockUser = {
      id: 1,
      email: 'test1@test.com',
      password: 'test',
    } as User;

    usersServiceMock.find = jest.fn().mockResolvedValue([mockUser]);

    try {
      await service.signUp(mockUser.email, mockUser.password);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('User already exists');
    }
  });

  it('should throw if userService returns undefined user somehow', async () => {
    const mockUser = {
      id: 1,
      email: 'test1@test.com',
      password: 'test',
    } as User;

    usersServiceMock.find = jest.fn().mockResolvedValue(undefined);

    try {
      await service.signUp(mockUser.email, mockUser.password);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('User already exists');
    }
  });

  it('should throw if signin is called with unused email', async () => {
    const mockUser = {
      email: '',
      password: '',
    };

    try {
      await service.signIn(mockUser.email, mockUser.password);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('User not found');
    }
  });

  it('should throw if provided password was incorrect', async () => {
    const mockUser = {
      id: 1,
      email: 'test2@test.com',
      password: 'test',
    } as User;

    await service.signUp(mockUser.email, mockUser.password);

    try {
      await service.signIn(mockUser.email, 'wrong password');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('Invalid password');
    }
  });

  it('should return user if signin was successful', async () => {
    const mockUser = {
      email: 'test3@test.com',
      password: 'test',
    } as User;

    const newUser = await service.signUp(mockUser.email, mockUser.password);

    const user = await service.signIn(mockUser.email, mockUser.password);

    expect(user).toBeDefined();

    expect(user.password).toEqual(newUser.password);
  });
});
