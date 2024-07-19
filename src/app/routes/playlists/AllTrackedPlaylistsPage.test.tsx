import {
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';

import { GetAllTrackedPlaylistResponseDto } from '@/api/playlists/contracts';
import { createMadeForAllPlaylist } from '@/testing/dataGenerators';
import { db } from '@/testing/mocks/db';
import { renderWithContext } from '@/testing/renderUtils';

import { AllTrackedPlaylistsPage } from './AllTrackedPlaylistsPage';

const loadingSkeletonTestId = 'all-tracked-playlists-loading-skeleton';
const trackedPlaylistPreviewTestId = 'tracked-playlist-preview';

const playlists = [
  createMadeForAllPlaylist({
    spotifyPlaylist: { name: 'Rock' },
    madeForAllPlaylist: {
      createdAt: dayjs().subtract(1, 'days').toISOString(),
    },
  }),
  createMadeForAllPlaylist({
    spotifyPlaylist: { name: 'reggae' },
    madeForAllPlaylist: {
      createdAt: dayjs().subtract(5, 'days').toISOString(),
    },
  }),
  createMadeForAllPlaylist({
    spotifyPlaylist: { name: 'Jazz' },
    madeForAllPlaylist: {
      createdAt: dayjs().subtract(3, 'days').toISOString(),
    },
  }),
  createMadeForAllPlaylist({
    spotifyPlaylist: { name: 'Pop' },
    madeForAllPlaylist: {
      createdAt: dayjs().subtract(4, 'days').toISOString(),
    },
  }),

  createMadeForAllPlaylist({
    spotifyPlaylist: { name: 'Blues' },
    madeForAllPlaylist: {
      createdAt: dayjs().subtract(0, 'days').toISOString(),
    },
  }),
] as GetAllTrackedPlaylistResponseDto;

/**
 * JSDOM doesn't implement PointerEvent so we need to mock our own implementation
 * Default to mouse left click interaction
 * https://github.com/radix-ui/primitives/issues/1822
 * https://github.com/jsdom/jsdom/pull/2666
 */
class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;

  constructor(type: string, props: PointerEventInit) {
    super(type, props);
    this.button = props.button || 0;
    this.ctrlKey = props.ctrlKey || false;
    this.pointerType = props.pointerType || 'mouse';
  }
}

describe('AllTrackedPlaylistsPage', () => {
  beforeAll(() => {
    window.PointerEvent = MockPointerEvent as any;
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  });

  it('should render', async () => {
    playlists.forEach((playlist) => {
      db.playlist.create(playlist);
    });

    renderWithContext(<AllTrackedPlaylistsPage />);

    expect(screen.getByText('All Tracked Playlists:')).toBeInTheDocument();

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId(loadingSkeletonTestId),
    );

    expect(screen.getByLabelText('Search Playlists')).toBeInTheDocument();
    expect(screen.getByLabelText('Sort By')).toBeInTheDocument();
    expect(screen.getByLabelText('Order By')).toBeInTheDocument();
  });

  it('should render the loading state initially', () => {
    playlists.forEach((playlist) => {
      db.playlist.create(playlist);
    });

    renderWithContext(<AllTrackedPlaylistsPage />);

    expect(screen.getByTestId(loadingSkeletonTestId)).toBeInTheDocument();
  });

  it('should show the paginated results', async () => {
    playlists.forEach((playlist) => {
      db.playlist.create(playlist);
    });

    renderWithContext(<AllTrackedPlaylistsPage />);

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId(loadingSkeletonTestId),
    );

    expect(screen.getAllByTestId(trackedPlaylistPreviewTestId).length).toBe(4);
    const pagination = screen.getByRole('navigation');
    expect(pagination).toBeInTheDocument();

    const activePage = screen.getByRole('button', { current: 'page' });
    expect(activePage).toBeInTheDocument();
    expect(within(activePage).getByText('1')).toBeInTheDocument();
  });

  it('should allow searching by playlist name', async () => {
    const user = userEvent.setup();

    playlists.forEach((playlist) => {
      db.playlist.create(playlist);
    });

    renderWithContext(<AllTrackedPlaylistsPage />);

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId(loadingSkeletonTestId),
    );

    const input = screen.getByLabelText('Search Playlists');
    await user.type(input, 'Ja');

    expect(screen.getAllByTestId(trackedPlaylistPreviewTestId).length).toBe(1);
    expect(screen.getByText('Jazz')).toBeInTheDocument();
  });

  it('should show an empty state if not matching playlists are found', async () => {
    const user = userEvent.setup();

    playlists.forEach((playlist) => {
      db.playlist.create(playlist);
    });

    renderWithContext(<AllTrackedPlaylistsPage />);

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId(loadingSkeletonTestId),
    );

    const input = screen.getByLabelText('Search Playlists');
    await user.type(input, 'Country');

    expect(
      screen.queryByTestId(trackedPlaylistPreviewTestId),
    ).not.toBeInTheDocument();
    expect(screen.getByText('No Results Found')).toBeInTheDocument();
  });

  it('should filter playlists by created date in descending order by default', async () => {
    playlists.forEach((playlist) => {
      db.playlist.create(playlist);
    });

    renderWithContext(<AllTrackedPlaylistsPage />);

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId(loadingSkeletonTestId),
    );

    const sortByFilter = screen.getByLabelText('Sort By');
    const orderByFilter = screen.getByLabelText('Order By');

    expect(within(sortByFilter).getByText('Created At')).toBeInTheDocument();
    expect(within(orderByFilter).getByText('Descending')).toBeInTheDocument();

    const playlistItems = screen.getAllByTestId(trackedPlaylistPreviewTestId);
    expect(playlistItems.length).toBe(4);

    const expectedOrder = ['Blues', 'Rock', 'Jazz', 'Pop'];
    expectedOrder.forEach((title, index) => {
      expect(within(playlistItems[index]).getByText(title)).toBeInTheDocument();
    });
  });

  it.each<[string, string, string[]]>([
    ['Title', 'Ascending', ['Blues', 'Jazz', 'Pop', 'reggae']],
    ['Title', 'Descending', ['Rock', 'reggae', 'Pop', 'Jazz']],
    ['Created At', 'Ascending', ['reggae', 'Pop', 'Jazz', 'Rock']],
    ['Created At', 'Descending', ['Blues', 'Rock', 'Jazz', 'Pop']],
  ])(
    'should allow filtering by %s in %s order',
    async (sortBy, orderBy, expectedOrder) => {
      const user = userEvent.setup();

      playlists.forEach((playlist) => {
        db.playlist.create(playlist);
      });

      renderWithContext(<AllTrackedPlaylistsPage />);

      await waitForElementToBeRemoved(() =>
        screen.queryByTestId(loadingSkeletonTestId),
      );

      // Click sort by filter -> sortBy
      const sortByFilter = screen.getByLabelText('Sort By');
      await user.click(sortByFilter);

      const sortByOption = screen.getByRole('option', { name: sortBy });
      expect(sortByOption).toBeInTheDocument();
      await user.click(sortByOption);

      // Click order by filter -> orderBy
      const orderByFilter = screen.getByLabelText('Order By');
      await user.click(orderByFilter);

      const orderByOption = screen.getByRole('option', {
        name: orderBy,
      });
      expect(orderByOption).toBeInTheDocument();
      await user.click(orderByOption);

      // Assert
      const playlistItems = screen.getAllByTestId(trackedPlaylistPreviewTestId);
      expect(playlistItems.length).toBe(4);

      expectedOrder.forEach((title, index) => {
        expect(
          within(playlistItems[index]).getByText(title),
        ).toBeInTheDocument();
      });
    },
  );

  it.todo(
    'should set current page to the first page if any filters are changed',
    async () => {},
  );
});
