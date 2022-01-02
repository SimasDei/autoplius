import { Test } from '@nestjs/testing';

import { AuthService } from '../auth.service';
import { User } from '../user.entity';
import { UsersService } from '../users.service';

describe('Auth service test suite', () => {
  it('should create instance of the auth service', async () => {
    const usersServiceMock: Partial<UsersService> = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({
          id: 1,
          email,
          password,
        } as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();

    const service = module.get(AuthService);

    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(AuthService);
  });
});
