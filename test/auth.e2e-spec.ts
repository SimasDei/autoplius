import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const mockUser = {
  email: 'test1@test.com',
  password: 'test',
};

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should handle sign up request', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(mockUser)
      .expect(201);

    expect(res.body.email).toBe(mockUser.email);
    expect(res.body.id).toBeDefined();
    expect(res.body.password).not.toEqual(mockUser.password);
  });

  it('should handle sign in request', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(mockUser)
      .expect(201);

    const { id, email } = res.body;

    const whoAmIRes = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', res.get('Set-Cookie'))
      .expect(200);

    expect(whoAmIRes.body.email).toBe(email);
    expect(whoAmIRes.body.id).toBe(id);
  });
});
