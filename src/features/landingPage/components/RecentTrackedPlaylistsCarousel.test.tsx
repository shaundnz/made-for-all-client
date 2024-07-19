import {
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { env } from '@/config/env';
import { db } from '@/testing/mocks/db';
import { withDelay } from '@/testing/mocks/middleware';
import { server } from '@/testing/mocks/server';
import { renderWithContext } from '@/testing/renderUtils';
import { createMadeForAllPlaylistsCreatedAtRelativeToNow } from '@/testing/testUtils';

import { RecentTrackedPlaylistsCarousel } from './RecentTrackedPlaylistsCarousel';

describe('RecentTrackedPlaylistsCarousel', () => {
  it('should render the recently tracked playlists in order', async () => {
    const playlists = createMadeForAllPlaylistsCreatedAtRelativeToNow([
      -3, -5, -1,
    ]);

    playlists.forEach((playlist) => {
      db.playlist.create(playlist);
    });

    renderWithContext(<RecentTrackedPlaylistsCarousel />);

    // Callback required, otherwise reference to element is kept, so
    // the element is not unmounted, but the contents is replaced with
    // the ready state
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId(
        'recent-tracked-playlists-carousel-loading-skeleton',
      ),
    );

    expect(screen.getByText('Recently Tracked Playlists:')).toBeInTheDocument();

    const expectedOrder = [-1, -3, -5];

    const playlistItems = screen.getAllByText(
      /^Playlist Name - Offset: (-?\d+)$/,
    );

    expect(playlistItems.length).toBe(3);

    expectedOrder.forEach((offset, index) => {
      expect(
        within(playlistItems[index]).getByText(
          `Playlist Name - Offset: ${offset}`,
        ),
      ).toBeInTheDocument();
    });
  });

  it('should render at most 6 playlist items', async () => {
    const playlists = createMadeForAllPlaylistsCreatedAtRelativeToNow([
      -3, -5, -1, -2, -3, -10, -12,
    ]);

    playlists.forEach((playlist) => {
      db.playlist.create(playlist);
    });

    renderWithContext(<RecentTrackedPlaylistsCarousel />);

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId(
        'recent-tracked-playlists-carousel-loading-skeleton',
      ),
    );

    expect(screen.getByText('Recently Tracked Playlists:')).toBeInTheDocument();
    expect(
      screen.getAllByText(/^Playlist Name - Offset: (-?\d+)$/).length,
    ).toBe(6);
  });

  it('should render nothing if there are no recently tracked playlists', async () => {
    const { container } = renderWithContext(<RecentTrackedPlaylistsCarousel />);

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId(
        'recent-tracked-playlists-carousel-loading-skeleton',
      ),
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should render the loading state initially', () => {
    renderWithContext(<RecentTrackedPlaylistsCarousel />);
    expect(
      screen.getByTestId('recent-tracked-playlists-carousel-loading-skeleton'),
    ).toBeInTheDocument();
  });

  it('should render nothing if the request for all playlists errors', async () => {
    server.use(
      http.get(
        `${env.API_BASE_URL}/playlists`,
        withDelay(() => {
          return HttpResponse.json(
            { message: 'Server Error' },
            { status: 500 },
          );
        }),
        { once: true },
      ),
    );

    const { container } = renderWithContext(<RecentTrackedPlaylistsCarousel />);

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId(
        'recent-tracked-playlists-carousel-loading-skeleton',
      ),
    );

    expect(container).toBeEmptyDOMElement();
  });
});
