import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { AuthService } from '../auth.service';
import { User } from '../user.entity';
import { NotFoundException } from '@nestjs/common';

let controller: UsersController;
let userServiceMock: Partial<UsersService>;
let authServiceMock: Partial<AuthService>;

const mockUser = {
  id: 1,
  email: 'test@test.com',
  password: 'test',
} as User;

describe('Users Controller', () => {
  userServiceMock = {
    findOne: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn().mockResolvedValue([mockUser]),
    delete: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
  };

  authServiceMock = {
    signUp: () => Promise.resolve(mockUser),
    signIn: () => Promise.resolve(mockUser),
  };

  const providers = [
    {
      provide: UsersService,
      useValue: userServiceMock,
    },
    {
      provide: AuthService,
      useValue: authServiceMock,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers,
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers should return list of users with the given email', async () => {
    const users = await controller.findAllUsers(mockUser.email);

    expect(users).toEqual([mockUser]);
  });

  it('findAllUsers should return empty if no users were found with the given email', async () => {
    userServiceMock.find = jest.fn().mockResolvedValue([]);

    const users = await controller.findAllUsers(mockUser.email);

    expect(users).toEqual([]);
  });

  it('findOneUser should return user with the given id', async () => {
    const user = await controller.findUser(mockUser.id.toString());

    expect(user).toEqual(mockUser);
  });

  it('findOneUser should return empty if no user was found with the given id', async () => {
    try {
      await controller.findUser('2');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('User not found');
    }
  });

  it('signIn should generate auth cookie and return user', async () => {
    const sessionMock = {};
    const user = await controller.signIn(
      { email: mockUser.email, password: mockUser.password },
      sessionMock,
    );

    expect(user).toEqual(mockUser);
    expect(sessionMock).toEqual({
      userId: mockUser.id,
    });
  });

  it('signIn should not generate session and return user if incorrect params were provided', async () => {
    const sessionMock = {};
    authServiceMock.signIn = jest
      .fn()
      .mockRejectedValue(new NotFoundException('User not found'));

    try {
      await controller.signIn({ email: '', password: '' }, sessionMock);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(sessionMock).toEqual({});
    }
  });

  it('signOut should remove user from session', () => {
    const sessionMock = {
      userId: mockUser.id,
    };

    controller.signOut(sessionMock);

    expect(sessionMock).toEqual({
      userId: null,
    });
  });

  it('whoAmI should return user object from session if user is logged in', () => {
    const user = controller.whoAmI(mockUser);

    expect(user).toEqual(mockUser);
  });

  it('createUser should create a user if correct data is provided', async () => {
    const mockSession = {};
    authServiceMock.signUp = jest.fn().mockResolvedValue(mockUser);
    userServiceMock.create = jest.fn().mockResolvedValue(mockUser);

    const user = await controller.createUser(mockUser, mockSession);

    expect(user).toEqual(mockUser);

    expect(authServiceMock.signUp).toHaveBeenCalledWith(
      mockUser.email,
      mockUser.password,
    );
    expect(mockSession).toStrictEqual({
      userId: mockUser.id,
    });
  });

  it('deleteUser should take id parameter and delete user with the specified id', async () => {
    userServiceMock.findOne = jest.fn().mockResolvedValue([mockUser]);

    await controller.deleteUser(mockUser.id.toString());

    const users = await controller.findAllUsers(mockUser.email);

    const user = users.find((user) => user.id === mockUser.id);

    expect(user).toBeUndefined();
  });

  it('updateUser should take param data and create a new user', async () => {
    const updateUser = {
      id: 1,
      email: 'test2@test.com',
      password: 'test',
    };

    userServiceMock.update = jest.fn().mockResolvedValue(updateUser);

    const user = await controller.updateUser(updateUser.id.toString(), {
      email: updateUser.email,
      password: updateUser.password,
    });

    expect(user).toEqual(updateUser);
  });
});
