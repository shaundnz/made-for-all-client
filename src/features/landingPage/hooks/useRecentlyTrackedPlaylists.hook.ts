import dayjs from 'dayjs';
import React from 'react';

import { useAllTrackedPlaylists } from '@/api/playlists';
import { GetAllTrackedPlaylistResponseDto } from '@/api/playlists/contracts';

export const useRecentlyTrackedPlaylists = (numberOfPlaylists: number) => {
  const selectRecentPlaylist = React.useCallback(
    (data: GetAllTrackedPlaylistResponseDto) => {
      const sortedPlaylistsMostRecentFirst = [...data].sort((a, b) =>
        dayjs(a.madeForAllPlaylist.createdAt).isAfter(
          dayjs(b.madeForAllPlaylist.createdAt),
        )
          ? 1
          : -1,
      );

      return sortedPlaylistsMostRecentFirst.slice(0, numberOfPlaylists);
    },
    [numberOfPlaylists],
  );

  const recentPlaylists = useAllTrackedPlaylists({
    queryConfig: { select: selectRecentPlaylist },
  });

  return recentPlaylists;
};
