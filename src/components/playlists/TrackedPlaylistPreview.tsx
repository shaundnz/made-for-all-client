import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ExternalLink } from 'lucide-react';

import { CreateTrackedPlaylistResponseDto } from '@/api/playlists/contracts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

dayjs.extend(relativeTime);

interface TrackedPlaylistPreviewProps {
  isLoading: boolean;
  showCreatedDate?: boolean;
  playlist?: CreateTrackedPlaylistResponseDto;
}

export const TrackedPlaylistPreview = ({
  isLoading,
  showCreatedDate,
  playlist,
}: TrackedPlaylistPreviewProps) => {
  if (isLoading) {
    return (
      <div data-testid="tracked-playlist-preview-loading-skeleton">
        <div className="flex items-center gap-x-2 sm:gap-x-6">
          <Skeleton className="size-16 rounded-xl sm:size-36" />
          <div className="flex grow flex-col gap-y-2">
            <Skeleton className="h-10" />
            <Skeleton className="hidden h-4 sm:block" />
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
      createdAt,
    },
  } = playlist;

  return (
    <div data-testid="tracked-playlist-preview">
      <div className="flex items-center gap-x-2 sm:gap-x-6">
        <img
          className="size-16 rounded-xl sm:size-36"
          src={images[0].url}
          alt={`${name} playlist cover`}
        />

        <div className="overflow-hidden">
          <div className="truncate text-xl font-bold md:text-3xl">{name}</div>
          <div className="hidden sm:block">{description}</div>
          {showCreatedDate && (
            <div className="mt-1 text-sm text-muted-foreground">
              {dayjs(createdAt).fromNow()}
            </div>
          )}
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
