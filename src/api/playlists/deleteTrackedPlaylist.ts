import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/apiClient';
import { MutationConfig } from '@/lib/reactQuery';

import { DeleteTrackedPlaylistsResponseDto } from './contracts';
import { getAllTrackedPlaylistsQueryOptions } from './getAllTrackedPlaylists';

export const deleteTrackedPlaylist = ({
  playlistId,
}: {
  playlistId: string;
}): Promise<DeleteTrackedPlaylistsResponseDto> => {
  return api.delete(`/playlists/${playlistId}`);
};

type UseDeleteTrackedPlaylistOptions = {
  mutationConfig?: MutationConfig<typeof deleteTrackedPlaylist>;
};

export const useDeleteTrackedPlaylist = ({
  mutationConfig,
}: UseDeleteTrackedPlaylistOptions = {}) => {
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
    mutationFn: deleteTrackedPlaylist,
  });
};
