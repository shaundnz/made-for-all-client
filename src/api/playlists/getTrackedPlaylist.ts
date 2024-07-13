import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/apiClient';
import { QueryConfig } from '@/lib/reactQuery';

import { GetTrackedPlaylistResponseDto } from './contracts';

export const getTrackedPlaylist = ({
  playlistId,
}: {
  playlistId: string;
}): Promise<GetTrackedPlaylistResponseDto> => {
  return api.get(`/playlists/${playlistId}`);
};

export const getTrackedPlaylistQueryOptions = (playlistId: string) => {
  return queryOptions({
    queryKey: ['playlists', playlistId],
    queryFn: () => getTrackedPlaylist({ playlistId }),
  });
};

type UseTrackedPlaylistOptions = {
  playlistId: string;
  queryConfig?: QueryConfig<typeof getTrackedPlaylistQueryOptions>;
};

export const useTrackedPlaylist = ({
  playlistId,
  queryConfig,
}: UseTrackedPlaylistOptions) => {
  return useQuery({
    ...getTrackedPlaylistQueryOptions(playlistId),
    ...queryConfig,
  });
};
