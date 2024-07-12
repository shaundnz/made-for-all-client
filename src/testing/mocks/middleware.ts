import { HttpResponseResolver } from 'msw';

import { networkDelay } from './utils';

export const withDelay = (
  resolver: HttpResponseResolver,
): HttpResponseResolver => {
  return async (args) => {
    await networkDelay();
    return resolver(args);
  };
};
