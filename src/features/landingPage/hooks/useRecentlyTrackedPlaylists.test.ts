import { renderHook, waitFor } from '@testing-library/react';

import { AppProvider } from '@/app/AppProvider';
import { db } from '@/testing/mocks/db';
import {
  assertValueDefined,
  createMadeForAllPlaylistsCreatedAtRelativeToNow,
} from '@/testing/testUtils';

import { useRecentlyTrackedPlaylists } from './useRecentlyTrackedPlaylists.hook';

describe('useRecentlyTrackedPlaylists', () => {
  it('should get the most recently tracked playlists with the most recent first', async () => {
    const playlists = createMadeForAllPlaylistsCreatedAtRelativeToNow([
      -3, -5, -1, -10, -12,
    ]);

    playlists.forEach((playlist) => {
      db.playlist.create(playlist);
    });

    const { result } = renderHook(() => useRecentlyTrackedPlaylists(4), {
      wrapper: AppProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    if (!assertValueDefined(result.current.data)) return;

    const data = result.current.data;

    expect(data.length).toBe(4);

    const expectedOrder = [-1, -3, -5, -10];

    expectedOrder.forEach((offset, index) => {
      expect(data[index].spotifyPlaylist.name).toBe(
        `Playlist Name - Offset: ${offset}`,
      );
    });
  });

  it('should get all playlists if the total number of playlists is less than number of recently tracked playlists requested', async () => {
    const playlists = createMadeForAllPlaylistsCreatedAtRelativeToNow([
      -3, -5, -1,
    ]);

    playlists.forEach((playlist) => {
      db.playlist.create(playlist);
    });

    const { result } = renderHook(() => useRecentlyTrackedPlaylists(10), {
      wrapper: AppProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    if (!assertValueDefined(result.current.data)) return;

    const data = result.current.data;

    expect(data.length).toBe(3);

    const expectedOrder = [-1, -3, -5];

    expectedOrder.forEach((offset, index) => {
      expect(data[index].spotifyPlaylist.name).toBe(
        `Playlist Name - Offset: ${offset}`,
      );
    });
  });
});
