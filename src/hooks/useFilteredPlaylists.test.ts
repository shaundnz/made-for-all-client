import { renderHook } from '@testing-library/react';
import dayjs from 'dayjs';

import { GetAllTrackedPlaylistResponseDto } from '@/api/playlists/contracts';
import { createMadeForAllPlaylist } from '@/testing/dataGenerators';

import {
  useFilteredPlaylists,
  PlaylistsFilterType,
  PlaylistsFilterOrder,
} from './useFilteredPlaylists.hook';

const playlists = [
  createMadeForAllPlaylist({
    spotifyPlaylist: { name: 'Rock' },
    madeForAllPlaylist: {
      createdAt: dayjs().subtract(1, 'days').toISOString(),
    },
  }),
  createMadeForAllPlaylist({
    spotifyPlaylist: { name: 'reggae' },
    madeForAllPlaylist: {
      createdAt: dayjs().subtract(5, 'days').toISOString(),
    },
  }),
  createMadeForAllPlaylist({
    spotifyPlaylist: { name: 'Jazz' },
    madeForAllPlaylist: {
      createdAt: dayjs().subtract(3, 'days').toISOString(),
    },
  }),
  createMadeForAllPlaylist({
    spotifyPlaylist: { name: 'Pop' },
    madeForAllPlaylist: {
      createdAt: dayjs().subtract(4, 'days').toISOString(),
    },
  }),
] as GetAllTrackedPlaylistResponseDto;

describe('useFilteredPlaylists', () => {
  it.each<[PlaylistsFilterType, PlaylistsFilterOrder, string[]]>([
    [
      PlaylistsFilterType.Title,
      PlaylistsFilterOrder.Ascending,
      ['Jazz', 'Pop', 'reggae', 'Rock'],
    ],
    [
      PlaylistsFilterType.Title,
      PlaylistsFilterOrder.Descending,
      ['Rock', 'reggae', 'Pop', 'Jazz'],
    ],
    [
      PlaylistsFilterType.CreatedAt,
      PlaylistsFilterOrder.Ascending,
      ['reggae', 'Pop', 'Jazz', 'Rock'],
    ],
    [
      PlaylistsFilterType.CreatedAt,
      PlaylistsFilterOrder.Descending,
      ['Rock', 'Jazz', 'Pop', 'reggae'],
    ],
  ])(
    'should sort playlists by %s in %s order',
    (playlistFilterType, playlistsFilterOrder, expectedOrder) => {
      const { result } = renderHook(() =>
        useFilteredPlaylists(
          playlistFilterType,
          playlistsFilterOrder,
          playlists,
        ),
      );

      expect(result.current.length).toBe(expectedOrder.length);
      expectedOrder.forEach((title, index) => {
        expect(result.current[index].spotifyPlaylist.name).toBe(title);
      });
    },
  );
});
