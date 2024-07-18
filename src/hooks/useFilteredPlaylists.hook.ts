import dayjs from 'dayjs';
import React from 'react';

import { GetAllTrackedPlaylistResponseDto } from '@/api/playlists/contracts';

export enum PlaylistsFilterType {
  Title = 'title',
  CreatedAt = 'createdAt',
}

export enum PlaylistsFilterOrder {
  Ascending = 'ascending',
  Descending = 'descending',
}

export const useFilteredPlaylists = (
  playlistsFilterType: PlaylistsFilterType,
  playlistsFilterOrder: PlaylistsFilterOrder,
  playlists: GetAllTrackedPlaylistResponseDto,
): GetAllTrackedPlaylistResponseDto => {
  const sortedPlaylists = React.useMemo(
    () =>
      [...playlists].sort((a, b) => {
        let comparison = 0;

        if (playlistsFilterType === PlaylistsFilterType.Title) {
          comparison = a.spotifyPlaylist.name.localeCompare(
            b.spotifyPlaylist.name,
            undefined,
            { sensitivity: 'base' },
          );
        } else if (playlistsFilterType === PlaylistsFilterType.CreatedAt) {
          comparison = dayjs(a.madeForAllPlaylist.createdAt).isBefore(
            dayjs(b.madeForAllPlaylist.createdAt),
          )
            ? -1
            : 1;
        }

        return playlistsFilterOrder === PlaylistsFilterOrder.Ascending
          ? comparison
          : -comparison;
      }),
    [playlists, playlistsFilterOrder, playlistsFilterType],
  );

  return sortedPlaylists;
};
