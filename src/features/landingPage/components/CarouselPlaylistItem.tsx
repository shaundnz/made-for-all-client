import { Button } from '../../../components/ui/button';

export interface CarouselPlaylistItemProps {
  title: string;
  playlistCoverImageUrl: string;
  externalPlaylistLink: string;
}

export const CarouselPlaylistItem = ({
  title,
  playlistCoverImageUrl,
  externalPlaylistLink,
}: CarouselPlaylistItemProps) => {
  return (
    <div className="space-y-2 p-1" data-testid="carousel-playlist-item">
      <Button
        asChild
        variant="link"
        className="flex h-full flex-col items-start p-0"
      >
        <a href={externalPlaylistLink} target="_blank" rel="noreferrer">
          <img
            className="rounded-xl"
            src={playlistCoverImageUrl}
            alt=""
            data-testid="carousel-playlist-item-playlist-cover"
          />
          <div className="text-wrap text-xl font-semibold">
            <span>{title}</span>
          </div>
        </a>
      </Button>
    </div>
  );
};
