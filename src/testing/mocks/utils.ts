import { delay } from 'msw';

export const networkDelay = () => {
  const delayTime = import.meta.env.TEST
    ? 50
    : Math.floor(Math.random() * 700) + 300;
  return delay(delayTime);
};
