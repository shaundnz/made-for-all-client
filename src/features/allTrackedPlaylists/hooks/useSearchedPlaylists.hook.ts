import React from 'react';

import { GetAllTrackedPlaylistResponseDto } from '@/api/playlists/contracts';

export const useSearchedPlaylists = (
  searchString: string,
  playlists: GetAllTrackedPlaylistResponseDto,
): GetAllTrackedPlaylistResponseDto => {
  const searchedPlaylists = React.useMemo(() => {
    const lowercaseSearchString = searchString.toLowerCase();
    return playlists.filter((playlist) =>
      playlist.spotifyPlaylist.name
        .toLowerCase()
        .startsWith(lowercaseSearchString),
    );
  }, [playlists, searchString]);

  return searchedPlaylists;
};
