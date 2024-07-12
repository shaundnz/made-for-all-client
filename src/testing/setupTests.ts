import { initializeDb, resetDb } from '@/testing/mocks/db';
import { server } from '@/testing/mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterAll(() => server.close());

beforeEach(() => {
  initializeDb();
});

afterEach(() => {
  server.resetHandlers();
  resetDb();
});
