import { renderHook } from '@testing-library/react';

import { GetAllTrackedPlaylistResponseDto } from '@/api/playlists/contracts';
import { createMadeForAllPlaylist } from '@/testing/dataGenerators';

import { useSearchedPlaylists } from './useSearchedPlaylists.hook';

const playlists = [
  createMadeForAllPlaylist({
    spotifyPlaylist: { name: 'Rock' },
  }),
  createMadeForAllPlaylist({
    spotifyPlaylist: { name: 'reggae' },
  }),
  createMadeForAllPlaylist({
    spotifyPlaylist: { name: 'Jazz' },
  }),
  createMadeForAllPlaylist({
    spotifyPlaylist: { name: 'Pop' },
  }),
] as GetAllTrackedPlaylistResponseDto;

describe('useSearchedPlaylists', () => {
  it('should return playlists that start with the case insensitive search string', () => {
    const searchString = 'r';
    const { result } = renderHook(() =>
      useSearchedPlaylists(searchString, playlists),
    );

    const expectedOrder = ['Rock', 'reggae'];

    expect(result.current.length).toBe(expectedOrder.length);
    expectedOrder.forEach((title, index) => {
      expect(result.current[index].spotifyPlaylist.name).toBe(title);
    });
  });

  it('should return playlists that start with the search string for mixed case input', () => {
    const searchString = 'jA';
    const { result } = renderHook(() =>
      useSearchedPlaylists(searchString, playlists),
    );

    const expectedOrder = ['Jazz'];

    expect(result.current.length).toBe(expectedOrder.length);
    expectedOrder.forEach((title, index) => {
      expect(result.current[index].spotifyPlaylist.name).toBe(title);
    });
  });

  it('should return an empty array if no playlists match the search string', () => {
    const searchString = 'Blues';
    const { result } = renderHook(() =>
      useSearchedPlaylists(searchString, playlists),
    );

    expect(result.current.length).toBe(0);
  });

  it('should return all playlists if the search string is empty', () => {
    const searchString = '';
    const { result } = renderHook(() =>
      useSearchedPlaylists(searchString, playlists),
    );

    expect(result.current.length).toBe(playlists.length);
    playlists.forEach((playlist, index) => {
      expect(result.current[index].spotifyPlaylist.name).toBe(
        playlist.spotifyPlaylist.name,
      );
    });
  });
});
