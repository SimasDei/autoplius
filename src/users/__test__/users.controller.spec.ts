import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { AuthService } from '../auth.service';
import { User } from '../user.entity';

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
});
