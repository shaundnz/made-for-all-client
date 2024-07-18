import { ExternalLink } from 'lucide-react';

import { CreateTrackedPlaylistResponseDto } from '@/api/playlists/contracts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface TrackedPlaylistPreviewProps {
  isLoading: boolean;
  playlist?: CreateTrackedPlaylistResponseDto;
}

export const TrackedPlaylistPreview = ({
  isLoading,
  playlist,
}: TrackedPlaylistPreviewProps) => {
  if (isLoading) {
    return (
      <div data-testid="tracked-playlist-preview-loading-skeleton">
        <div className="flex items-center gap-x-6">
          <Skeleton className="size-36 rounded-xl" />
          <div className="flex grow flex-col gap-y-2">
            <Skeleton className="h-10" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return null;
  }

  const {
    spotifyPlaylist: { name, description, images },
    madeForAllPlaylist: {
      external_urls: { spotify: madeForAllPlaylistLink },
    },
  } = playlist;

  return (
    <div data-testid="tracked-playlist-preview">
      <div className="flex items-center gap-x-6">
        <img
          className="size-36 rounded-xl"
          src={images[0].url}
          alt={`${name} playlist cover`}
        />

        <div>
          <div className="text-4xl font-bold">{name}</div>
          <div className="text-lg">{description}</div>
          <Button asChild variant="link">
            <a href={madeForAllPlaylistLink} target="_blank" rel="noreferrer">
              Go to playlist&nbsp;
              <ExternalLink className="mr-2 size-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};
