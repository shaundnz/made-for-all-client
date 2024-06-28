import { env } from './env';

describe('env variables', () => {
  it('should  set all env variables', () => {
    expect(env.MADE_FOR_ALL_API_BASE_URL).toBeTruthy();
  });
});
