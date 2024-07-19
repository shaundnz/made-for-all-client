import { env } from './env';

describe('env variables', () => {
  it('should set all required env variables', () => {
    expect(env.API_BASE_URL).toBeTruthy();
  });
});
