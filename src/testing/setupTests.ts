import '@testing-library/jest-dom/vitest';

import { initializeDb, resetDb } from '@/testing/mocks/db';
import { server } from '@/testing/mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterAll(() => server.close());

beforeEach(() => {
  const IntersectionObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  const matchingMediaQueries: string[] = [];

  const matchMediaMock = vi.fn((query: string) => ({
    matches: matchingMediaQueries.includes(query),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));

  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
  vi.stubGlobal('matchMedia', matchMediaMock);
  initializeDb();
});

afterEach(() => {
  server.resetHandlers();
  resetDb();
});
