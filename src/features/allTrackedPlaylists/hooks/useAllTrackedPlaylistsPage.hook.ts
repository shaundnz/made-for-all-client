import { GetAllTrackedPlaylistResponseDto } from '@/api/playlists/contracts';
import {
  PlaylistsFilterOrder,
  PlaylistsFilterType,
  useFilteredPlaylists,
  usePaginatedItems,
} from '@/hooks';

import { useSearchedPlaylists } from './useSearchedPlaylists.hook';

export const useAllTrackedPlaylistPage = (
  playlists: GetAllTrackedPlaylistResponseDto,
  resultsPerPage: number,
  searchString: string,
  playlistsFilterType: PlaylistsFilterType,
  playlistsFilterOrder: PlaylistsFilterOrder,
) => {
  const searchedPlaylists = useSearchedPlaylists(searchString, playlists);
  const searchedAndFilteredPlaylists = useFilteredPlaylists(
    playlistsFilterType,
    playlistsFilterOrder,
    searchedPlaylists,
  );

  const paginatedResults = usePaginatedItems(
    searchedAndFilteredPlaylists,
    resultsPerPage,
  );

  return paginatedResults;
};
