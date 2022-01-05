import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

global.afterEach(async () => {
  const connection = getConnection();
  try {
    await connection.close();
  } catch (error) {
    console.log(
      '🚀 ~ file: setup.ts ~ line 11 ~ global.afterEach ~ error',
      error,
    );
    throw error;
  }
});

global.beforeEach(async () => {
  try {
    rm(join(__dirname, '..', 'test.sqlite'));
  } catch (error) {}
});
