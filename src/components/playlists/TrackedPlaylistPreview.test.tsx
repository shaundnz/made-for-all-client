import { render, screen, within } from '@testing-library/react';
import dayjs from 'dayjs';

import { CreateTrackedPlaylistResponseDto } from '@/api/playlists/contracts';
import { createMadeForAllPlaylist } from '@/testing/dataGenerators';

import { TrackedPlaylistPreview } from './TrackedPlaylistPreview';

const loadingSkeletonDataTestId = 'tracked-playlist-preview-loading-skeleton';
const trackedPlaylist =
  createMadeForAllPlaylist() as CreateTrackedPlaylistResponseDto;

describe('TrackedPlaylistPreview', () => {
  it('should render', () => {
    const {
      spotifyPlaylist: { name, description },
      madeForAllPlaylist: { createdAt },
    } = trackedPlaylist;

    render(
      <TrackedPlaylistPreview isLoading={false} playlist={trackedPlaylist} />,
    );

    const fromNowString = dayjs(createdAt).fromNow();

    expect(
      screen.queryByTestId(loadingSkeletonDataTestId),
    ).not.toBeInTheDocument();

    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.queryByText(fromNowString)).not.toBeInTheDocument();
    expect(screen.getByText('Go to playlist')).toBeInTheDocument();
  });

  it('should render the loading state', () => {
    render(<TrackedPlaylistPreview isLoading={true} />);
    expect(screen.getByTestId(loadingSkeletonDataTestId)).toBeInTheDocument();
  });

  it('should render the createdAt date relative to now', () => {
    const {
      madeForAllPlaylist: { createdAt },
    } = trackedPlaylist;

    render(
      <TrackedPlaylistPreview
        isLoading={false}
        playlist={trackedPlaylist}
        showCreatedDate
      />,
    );

    const fromNowString = dayjs(createdAt).fromNow();
    expect(screen.getByText(fromNowString)).toBeInTheDocument();
  });

  it('should render nothing is isLoading is false and playlist is not set', () => {
    const { container } = render(<TrackedPlaylistPreview isLoading={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should link to a spotify playlist and open in a new tab', () => {
    const {
      madeForAllPlaylist: {
        external_urls: { spotify: externalPlaylistLink },
      },
    } = trackedPlaylist;

    render(
      <TrackedPlaylistPreview isLoading={false} playlist={trackedPlaylist} />,
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(within(link).getByText('Go to playlist')).toBeInTheDocument();
    expect(link).toHaveAttribute('href', externalPlaylistLink);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('should render the playlist cover with an accessible alt tag', () => {
    const {
      spotifyPlaylist: { name, images },
    } = trackedPlaylist;

    render(
      <TrackedPlaylistPreview isLoading={false} playlist={trackedPlaylist} />,
    );

    const image = screen.getByAltText(`${name} playlist cover`);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', images[0].url);
  });
});
