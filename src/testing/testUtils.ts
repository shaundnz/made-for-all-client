import dayjs from 'dayjs';

import { createMadeForAllPlaylist } from './dataGenerators';

// Helper function to assist typescript compiler in knowing that a value is defined after we assert
export const assertValueDefined = <T>(value: T | undefined): value is T => {
  expect(value).toBeDefined();
  if (value === undefined) {
    throw new Error('value is undefined');
  }
  return true;
};

export const createMadeForAllPlaylistsCreatedAtRelativeToNow = (
  offsets: number[],
) => {
  const now = new Date();

  return offsets.map((offset) =>
    createMadeForAllPlaylist({
      spotifyPlaylist: {
        name: `Playlist Name - Offset: ${offset}`,
      },
      madeForAllPlaylist: {
        createdAt: dayjs(now).add(offset, 'day').toISOString(),
      },
    }),
  );
};
