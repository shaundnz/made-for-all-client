import { render, screen, within } from '@testing-library/react';

import { generateMadeForAllPlaylist } from '@/testing/dataGenerators';

import { NewTrackedPlaylist } from './NewTrackedPlaylist';

const loadingSkeletonDataTestId = 'new-tracked-playlist-loading-skeleton';
const trackedPlaylist = generateMadeForAllPlaylist();

describe('NewTrackedPlaylist', () => {
  it('should render', () => {
    const {
      spotifyPlaylist: { name, description },
    } = trackedPlaylist;

    render(
      <NewTrackedPlaylist
        isLoading={false}
        mostRecentlyTrackedPlaylist={trackedPlaylist}
      />,
    );

    expect(
      screen.queryByTestId(loadingSkeletonDataTestId),
    ).not.toBeInTheDocument();

    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByText('Go to playlist')).toBeInTheDocument();
  });

  it('should render the loading state', () => {
    render(<NewTrackedPlaylist isLoading={true} />);
    expect(screen.getByTestId(loadingSkeletonDataTestId)).toBeInTheDocument();
  });

  it('should render nothing is isLoading is false and mostRecentlyTrackedPlaylist is not set', () => {
    const { container } = render(<NewTrackedPlaylist isLoading={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should link to a spotify playlist and open in a new tab', () => {
    const {
      madeForAllPlaylist: {
        external_urls: { spotify: externalPlaylistLink },
      },
    } = trackedPlaylist;

    render(
      <NewTrackedPlaylist
        isLoading={false}
        mostRecentlyTrackedPlaylist={trackedPlaylist}
      />,
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
      <NewTrackedPlaylist
        isLoading={false}
        mostRecentlyTrackedPlaylist={trackedPlaylist}
      />,
    );

    const image = screen.getByAltText(`${name} playlist cover`);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', images[0].url);
  });
});
