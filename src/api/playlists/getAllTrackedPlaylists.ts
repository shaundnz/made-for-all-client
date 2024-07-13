import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/apiClient';
import { QueryConfig } from '@/lib/reactQuery';

import { GetAllTrackedPlaylistResponseDto } from './contracts';

export const getAllTrackedPlaylists =
  (): Promise<GetAllTrackedPlaylistResponseDto> => {
    return api.get(`/playlists`);
  };

export const getAllTrackedPlaylistsQueryOptions = () => {
  return queryOptions({
    queryKey: ['playlists'],
    queryFn: () => getAllTrackedPlaylists(),
  });
};

type UseAllTrackedPlaylistsOptions = {
  queryConfig?: QueryConfig<typeof getAllTrackedPlaylistsQueryOptions>;
};

export const useAllTrackedPlaylists = ({
  queryConfig,
}: UseAllTrackedPlaylistsOptions) => {
  return useQuery({
    ...getAllTrackedPlaylistsQueryOptions(),
    ...queryConfig,
  });
};
