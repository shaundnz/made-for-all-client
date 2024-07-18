import React from 'react';

import {
  CreateTrackedPlaylistResponseDto,
  GetAllTrackedPlaylistResponseDto,
} from '@/api/playlists/contracts';

export enum TrackedPlaylistViewState {
  None = 'None',
  Loading = 'Loading',
  NewTrackedPlaylist = 'NewTrackedPlaylist',
  PreviouslyTrackedPlaylist = 'PreviouslyTrackedPlaylist',
}

interface ShowTrackedPlaylistBase {
  setMostRecentlyTrackedPlaylist: React.Dispatch<
    React.SetStateAction<CreateTrackedPlaylistResponseDto | null>
  >;
}

export interface ShowTrackedPlaylist extends ShowTrackedPlaylistBase {
  trackedPlaylistViewState:
    | TrackedPlaylistViewState.PreviouslyTrackedPlaylist
    | TrackedPlaylistViewState.NewTrackedPlaylist;
  trackedPlaylist: CreateTrackedPlaylistResponseDto;
}

interface HideTrackedPlaylist extends ShowTrackedPlaylistBase {
  trackedPlaylistViewState:
    | TrackedPlaylistViewState.None
    | TrackedPlaylistViewState.Loading;
}

type TrackedPlaylist = ShowTrackedPlaylist | HideTrackedPlaylist;

interface UseTrackedPlaylistsPreviewProps {
  allPlaylistsLoading: boolean;
  allPlaylistsData: GetAllTrackedPlaylistResponseDto;
  formSubmitting: boolean;
  formSubmitted: boolean;
  formSubmittedSuccessfully: boolean;
  inputPlaylistIdValue: string;
}

export const useTrackedPlaylistPreview = ({
  allPlaylistsLoading,
  allPlaylistsData,
  inputPlaylistIdValue,
  formSubmitting,
  formSubmitted,
  formSubmittedSuccessfully,
}: UseTrackedPlaylistsPreviewProps): TrackedPlaylist => {
  const [mostRecentlyTrackedPlaylist, setMostRecentlyTrackedPlaylist] =
    React.useState<CreateTrackedPlaylistResponseDto | null>(null);

  const matchingPlaylist = React.useMemo(() => {
    const parts = inputPlaylistIdValue.split('/');
    const playlistId = parts.pop();
    return allPlaylistsData?.find(
      (playlist) => playlist.spotifyPlaylist.id === playlistId,
    );
  }, [allPlaylistsData, inputPlaylistIdValue]);

  if (formSubmitting) {
    return {
      setMostRecentlyTrackedPlaylist,
      trackedPlaylistViewState: TrackedPlaylistViewState.Loading,
    };
  }

  if (allPlaylistsLoading) {
    return {
      setMostRecentlyTrackedPlaylist,
      trackedPlaylistViewState: TrackedPlaylistViewState.None,
    };
  }

  if (matchingPlaylist !== undefined) {
    return {
      setMostRecentlyTrackedPlaylist,
      trackedPlaylist: matchingPlaylist,
      trackedPlaylistViewState:
        TrackedPlaylistViewState.PreviouslyTrackedPlaylist,
    };
  }

  if (!formSubmitted) {
    return {
      setMostRecentlyTrackedPlaylist,
      trackedPlaylistViewState: TrackedPlaylistViewState.None,
    };
  }

  if (formSubmitted && !formSubmittedSuccessfully) {
    return {
      setMostRecentlyTrackedPlaylist,
      trackedPlaylistViewState: TrackedPlaylistViewState.None,
    };
  }

  if (!mostRecentlyTrackedPlaylist) {
    return {
      setMostRecentlyTrackedPlaylist,
      trackedPlaylistViewState: TrackedPlaylistViewState.None,
    };
  }

  return {
    setMostRecentlyTrackedPlaylist,
    trackedPlaylist: mostRecentlyTrackedPlaylist,
    trackedPlaylistViewState: TrackedPlaylistViewState.NewTrackedPlaylist,
  };
};
