import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/apiClient';
import { MutationConfig } from '@/lib/reactQuery';

import {
  UpdateTrackedPlaylistRequestDto,
  UpdateTrackedPlaylistResponseDto,
} from './contracts';
import { getTrackedPlaylistQueryOptions } from './getTrackedPlaylist';

export const updateTrackedPlaylist = ({
  data,
}: {
  data: UpdateTrackedPlaylistRequestDto;
}): Promise<UpdateTrackedPlaylistResponseDto> => {
  return api.put(`/playlists`, data);
};

type UseUpdateTrackedPlaylistOptions = {
  mutationConfig?: MutationConfig<typeof updateTrackedPlaylist>;
};

export const useUpdateTrackedPlaylist = ({
  mutationConfig,
}: UseUpdateTrackedPlaylistOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.refetchQueries({
        queryKey: getTrackedPlaylistQueryOptions(data.spotifyPlaylistId)
          .queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateTrackedPlaylist,
  });
};
