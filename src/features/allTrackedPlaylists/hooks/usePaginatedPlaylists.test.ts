import { renderHook, act } from '@testing-library/react';

import { GetAllTrackedPlaylistResponseDto } from '@/api/playlists/contracts';
import { createMadeForAllPlaylist } from '@/testing/dataGenerators';

import { usePaginatedPlaylists } from './usePaginatedPlaylists.hook';

const playlists = Array.from({ length: 5 }).map(() =>
  createMadeForAllPlaylist(),
) as GetAllTrackedPlaylistResponseDto;

describe('usePaginatedPlaylists', () => {
  it('should return the first page of results on initial render', () => {
    const { result } = renderHook(() => usePaginatedPlaylists(playlists, 2));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(false);
    expect(result.current.paginatedPlaylists.length).toBe(2);
    expect(result.current.paginatedPlaylists).toEqual(playlists.slice(0, 2));
  });

  it('should return currentPage equal to 1 if playlists is empty', () => {
    const { result } = renderHook(() => usePaginatedPlaylists([], 2));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPreviousPage).toBe(false);
    expect(result.current.paginatedPlaylists.length).toBe(0);
  });

  it('should increment the page', () => {
    const { result } = renderHook(() => usePaginatedPlaylists(playlists, 2));

    act(() => {
      result.current.incrementPage();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(true);
    expect(result.current.paginatedPlaylists.length).toBe(2);
    expect(result.current.paginatedPlaylists).toEqual(playlists.slice(2, 4));
  });

  it('should decrement the page', () => {
    const { result } = renderHook(() => usePaginatedPlaylists(playlists, 2));

    act(() => {
      result.current.incrementPage();
    });

    expect(result.current.currentPage).toBe(2);

    act(() => {
      result.current.decrementPage();
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(false);
    expect(result.current.paginatedPlaylists.length).toBe(2);
    expect(result.current.paginatedPlaylists).toEqual(playlists.slice(0, 2));
  });

  it('should not decrement the page below 1', () => {
    const { result } = renderHook(() => usePaginatedPlaylists(playlists, 2));

    act(() => {
      result.current.decrementPage();
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(false);
    expect(result.current.paginatedPlaylists.length).toBe(2);
    expect(result.current.paginatedPlaylists).toEqual(playlists.slice(0, 2));
  });

  it('should not increment the page above totalPages', () => {
    const { result } = renderHook(() => usePaginatedPlaylists(playlists, 3));

    act(() => {
      result.current.incrementPage();
    });

    act(() => {
      result.current.incrementPage();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPreviousPage).toBe(true);
    expect(result.current.paginatedPlaylists.length).toBe(2);
    expect(result.current.paginatedPlaylists).toEqual(playlists.slice(3, 5));
  });

  it('should adjust current page to the last page if the list is shortened and the previous current page exceeds total pages', () => {
    const { result, rerender } = renderHook(
      ({ playlists, resultsPerPage }) =>
        usePaginatedPlaylists(playlists, resultsPerPage),
      {
        initialProps: { playlists, resultsPerPage: 2 },
      },
    );

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(3);

    act(() => {
      result.current.incrementPage();
    });

    act(() => {
      result.current.incrementPage();
    });

    expect(result.current.currentPage).toBe(3);

    const shorterPlaylists = playlists.slice(0, 3);
    rerender({ playlists: shorterPlaylists, resultsPerPage: 2 });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPreviousPage).toBe(true);
    expect(result.current.paginatedPlaylists.length).toBe(1);
    expect(result.current.paginatedPlaylists).toEqual(
      shorterPlaylists.slice(2, 3),
    );
  });
});
