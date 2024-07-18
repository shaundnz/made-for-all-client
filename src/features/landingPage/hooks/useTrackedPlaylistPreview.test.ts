import { act, renderHook } from '@testing-library/react';

import {
  CreateTrackedPlaylistResponseDto,
  GetAllTrackedPlaylistResponseDto,
} from '@/api/playlists/contracts';
import { createMadeForAllPlaylist } from '@/testing/dataGenerators';

import {
  ShowTrackedPlaylist,
  TrackedPlaylistViewState,
  useTrackedPlaylistPreview,
} from './useTrackedPlaylistPreview.hook';

const defaultArgs = {
  allPlaylistsLoading: false,
  allPlaylistsData: [],
  formSubmitting: false,
  formSubmitted: false,
  formSubmittedSuccessfully: false,
  inputPlaylistIdValue: '',
};

describe('useTrackedPlaylistPreview', () => {
  it('should return a none view state state if allPlaylistsLoading is true', () => {
    const { result } = renderHook(() =>
      useTrackedPlaylistPreview({ ...defaultArgs, allPlaylistsLoading: true }),
    );

    expect(result.current.trackedPlaylistViewState).toBe(
      TrackedPlaylistViewState.None,
    );
  });

  it('should return a loading state if formSubmitting is true', () => {
    const { result } = renderHook(() =>
      useTrackedPlaylistPreview({ ...defaultArgs, formSubmitting: true }),
    );

    expect(result.current.trackedPlaylistViewState).toBe(
      TrackedPlaylistViewState.Loading,
    );
  });

  it('should get a matching playlist if inputPlaylistIdValue is already tracked', () => {
    const allPlaylistsData = [
      createMadeForAllPlaylist({ spotifyPlaylist: { id: '1' } }),
    ] as GetAllTrackedPlaylistResponseDto;
    const inputPlaylistIdValue = '1'; // Assuming '1' exists in mockAllPlaylistsData
    const { result } = renderHook(() =>
      useTrackedPlaylistPreview({
        ...defaultArgs,
        allPlaylistsData: allPlaylistsData,
        inputPlaylistIdValue,
      }),
    );

    expect(result.current.trackedPlaylistViewState).toBe(
      TrackedPlaylistViewState.PreviouslyTrackedPlaylist,
    );

    const data = result.current as ShowTrackedPlaylist;
    expect(data.trackedPlaylist).toBeDefined();
    expect(data.trackedPlaylist.spotifyPlaylist.id).toBe(inputPlaylistIdValue);
  });

  it('should return a none view state if the page has loaded but the form has not been submitted', () => {
    const { result } = renderHook(() => useTrackedPlaylistPreview(defaultArgs));

    expect(result.current.trackedPlaylistViewState).toBe(
      TrackedPlaylistViewState.None,
    );
  });

  it('should return a none view state if the form has been submitted but did not succeed', () => {
    const { result } = renderHook(() =>
      useTrackedPlaylistPreview({ ...defaultArgs, formSubmitted: true }),
    );

    expect(result.current.trackedPlaylistViewState).toBe(
      TrackedPlaylistViewState.None,
    );
  });

  it('should return a none view state if the form has been submitted successfully but no mostRecentlyTrackedPlaylist is set', () => {
    const { result } = renderHook(() =>
      useTrackedPlaylistPreview({
        ...defaultArgs,
        formSubmitted: true,
        formSubmittedSuccessfully: true,
      }),
    );

    expect(result.current.trackedPlaylistViewState).toBe(
      TrackedPlaylistViewState.None,
    );
  });

  it('should return the mostRecentlyTrackedPlaylist if the form submitted successfully', async () => {
    const newPlaylist = createMadeForAllPlaylist({
      spotifyPlaylist: {
        name: 'New Playlist',
      },
    }) as CreateTrackedPlaylistResponseDto;

    const { result, rerender } = renderHook(
      (props) =>
        useTrackedPlaylistPreview({
          ...props,
        }),
      {
        initialProps: defaultArgs,
      },
    );

    rerender({
      ...defaultArgs,
      formSubmitted: true,
      formSubmittedSuccessfully: true,
    });

    act(() => {
      result.current.setMostRecentlyTrackedPlaylist(newPlaylist);
    });

    expect(result.current.trackedPlaylistViewState).toBe(
      TrackedPlaylistViewState.NewTrackedPlaylist,
    );

    const data = result.current as ShowTrackedPlaylist;

    expect(data.trackedPlaylist.spotifyPlaylist.name).toBe('New Playlist');
  });
});
