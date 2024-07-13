import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/apiClient';
import { MutationConfig } from '@/lib/reactQuery';

import {
  CreateTrackedPlaylistRequestDto,
  CreateTrackedPlaylistResponseDto,
} from './contracts';
import { getAllTrackedPlaylistsQueryOptions } from './getAllTrackedPlaylists';

export const createTrackedPlaylist = ({
  data,
}: {
  data: CreateTrackedPlaylistRequestDto;
}): Promise<CreateTrackedPlaylistResponseDto> => {
  return api.post(`/playlists`, data);
};

type UseCreateTrackedPlaylistOptions = {
  mutationConfig?: MutationConfig<typeof createTrackedPlaylist>;
};

export const useCreateTrackedPlaylist = ({
  mutationConfig,
}: UseCreateTrackedPlaylistOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getAllTrackedPlaylistsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createTrackedPlaylist,
  });
};
