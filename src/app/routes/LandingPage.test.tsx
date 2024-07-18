import {
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { env } from '@/config/env';
import { createMadeForAllPlaylist } from '@/testing/dataGenerators';
import { db } from '@/testing/mocks/db';
import { withDelay } from '@/testing/mocks/middleware';
import { server } from '@/testing/mocks/server';
import { renderWithContext } from '@/testing/renderUtils';
import { createMadeForAllPlaylistsCreatedAtRelativeToNow } from '@/testing/testUtils';

import { LandingPage } from './LandingPage';

describe('LandingPage', () => {
  it('should display the page title and recently tracked playlists', async () => {
    const playlists = createMadeForAllPlaylistsCreatedAtRelativeToNow([
      -3, -5, -1,
    ]);

    playlists.forEach((playlist) => {
      db.playlist.create(playlist);
    });

    renderWithContext(<LandingPage />);

    expect(screen.getByText('Made For All!')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Enter a "Made For You" Spotify playlist, and generate a playlist of the the original, uncustomized version.',
      ),
    ).toBeInTheDocument();

    expect(screen.getByText('Recently Tracked Playlists:')).toBeInTheDocument();

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId(
        'recent-tracked-playlists-carousel-loading-skeleton',
      ),
    );

    expect(
      screen.getAllByText(/^Playlist Name - Offset: (-?\d+)$/).length,
    ).toBe(3);
  });

  it('should show a link to the all tracked playlists page', () => {
    renderWithContext(<LandingPage />);

    const link = screen.getByRole('link', {
      name: 'View All Tracked Playlists',
    });

    expect(link).toBeInTheDocument();
    expect(link).toBeEnabled();
    expect(link).toHaveAttribute('href', '/playlists');
  });

  it.each([
    'https://example.com',
    'https://open.spotify.com/playlist',
    'https://open.spotify.com/playlist/37i9dQZF1DX89EkrAT8Z6',
    'https://open.spotify.com/playlist/37i9dQZF1DX89EkrAT8Z6cc',
  ])(
    'should show validation errors if the input is not a valid playlist link',
    async (invalidInput) => {
      const user = userEvent.setup();

      renderWithContext(<LandingPage />);

      const input = screen.getByLabelText('Spotify playlist link');
      await user.type(input, invalidInput);

      expect(
        screen.getByText('Not a valid Spotify playlist URL'),
      ).toBeInTheDocument();

      expect(input).toHaveAttribute('aria-invalid', 'true');
    },
  );

  it('should allow the user to track a playlist', async () => {
    const newPlaylist = createMadeForAllPlaylist({
      spotifyPlaylist: { name: 'My New Playlist' },
    });

    server.use(
      http.post(
        `${env.MADE_FOR_ALL_API_BASE_URL}/playlists`,
        withDelay(() => {
          db.playlist.create(newPlaylist);
          return HttpResponse.json(newPlaylist);
        }),
      ),
    );

    const user = userEvent.setup();

    renderWithContext(<LandingPage />);

    const input = screen.getByLabelText('Spotify playlist link');
    await user.type(
      input,
      'https://open.spotify.com/playlist/37i9dQZF1DX89EkrAT8Z6c',
    );

    const submit = screen.getByRole('button', { name: 'Track Playlist' });

    expect(submit).toBeEnabled();

    await user.click(submit);

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('tracked-playlist-preview-loading-skeleton'),
    );

    expect(screen.getByText('My New Playlist')).toBeInTheDocument();
  });

  it('should show a validation error and the already tracked playlist if the playlist is already tracked', async () => {
    const playlistId = '37i9dQZF1DX89EkrAT8Z6c';
    const playlistName = 'Already Tracked Playlist';
    const alreadyTrackedPlaylist = createMadeForAllPlaylist({
      spotifyPlaylist: {
        id: playlistId,
        name: playlistName,
      },
    });

    db.playlist.create(alreadyTrackedPlaylist);

    const user = userEvent.setup();

    renderWithContext(<LandingPage />);

    const input = screen.getByLabelText('Spotify playlist link');
    await user.type(input, `https://open.spotify.com/playlist/${playlistId}`);

    const submit = screen.getByRole('button', { name: 'Track Playlist' });

    expect(submit).toBeDisabled();

    expect(
      screen.getByText('This playlist is already tracked'),
    ).toBeInTheDocument();

    const playlistPreview = screen.getByTestId('tracked-playlist-preview');
    expect(playlistPreview).toBeInTheDocument();
    expect(within(playlistPreview).getByText(playlistName)).toBeInTheDocument();
  });

  it('should show an error toast if the track playlist request fails', async () => {
    server.use(
      http.post(
        `${env.MADE_FOR_ALL_API_BASE_URL}/playlists`,
        withDelay(() => {
          return HttpResponse.json(
            { message: 'Server Error' },
            { status: 500 },
          );
        }),
      ),
    );

    const user = userEvent.setup();

    renderWithContext(<LandingPage />);

    const input = screen.getByLabelText('Spotify playlist link');
    await user.type(
      input,
      'https://open.spotify.com/playlist/37i9dQZF1DX89EkrAT8Z6c',
    );

    const submit = screen.getByRole('button', { name: 'Track Playlist' });

    expect(submit).toBeEnabled();

    await user.click(submit);

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('tracked-playlist-preview-loading-skeleton'),
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();

    expect(
      screen.queryByTestId('tracked-playlist-preview'),
    ).not.toBeInTheDocument();
  });
});
