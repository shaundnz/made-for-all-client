import { render, screen, within } from '@testing-library/react';

import { CarouselPlaylistItem } from './CarouselPlaylistItem';

const defaultProps = {
  title: 'Playlist Title',
  playlistCoverImageUrl: 'www.example.com/cover.jpg',
  externalPlaylistLink: 'www.example.com/playlist/123',
};

describe('CarouselPlaylistItem', () => {
  it('should render an accessible link', () => {
    const { title } = defaultProps;
    render(<CarouselPlaylistItem {...defaultProps} />);

    const link = screen.getByRole('link', { name: title });
    expect(link).toBeInTheDocument();
    expect(within(link).getByText(title)).toBeInTheDocument();
  });

  it('should render the image', () => {
    const { playlistCoverImageUrl } = defaultProps;
    render(<CarouselPlaylistItem {...defaultProps} />);

    const image = screen.getByTestId('carousel-playlist-item-playlist-cover');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', playlistCoverImageUrl);
  });

  it('should link to the spotify playlist and open in a new tab', () => {
    const { externalPlaylistLink } = defaultProps;

    render(<CarouselPlaylistItem {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', externalPlaylistLink);
    expect(link).toHaveAttribute('target', '_blank');
  });
});
