import AutoScroll from 'embla-carousel-auto-scroll';
import React from 'react';

import { useAllTrackedPlaylists } from '@/api/playlists';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useFilteredPlaylists,
  PlaylistsFilterOrder,
  PlaylistsFilterType,
} from '@/hooks';

import { CarouselPlaylistItem } from './CarouselPlaylistItem';

const MAX_NUMBER_PLAYLISTS_TO_SHOW = 6;

export const RecentTrackedPlaylistsCarousel = () => {
  const { isLoading, isError, data } = useAllTrackedPlaylists();
  const orderedPlaylists = useFilteredPlaylists(
    PlaylistsFilterType.CreatedAt,
    PlaylistsFilterOrder.Descending,
    data ? data : [],
  );

  const carouselPlaylistItems = React.useMemo(
    () => orderedPlaylists.slice(0, MAX_NUMBER_PLAYLISTS_TO_SHOW),
    [orderedPlaylists],
  );

  if (isLoading) {
    return (
      <div data-testid="recent-tracked-playlists-carousel-loading-skeleton">
        <div className="mb-4 text-xl font-bold">
          Recently Tracked Playlists:
        </div>
        <div className="flex h-52 space-x-4">
          <Skeleton className="grow" />
          <Skeleton className="grow" />
          <Skeleton className="hidden grow lg:block" />
        </div>
      </div>
    );
  }

  if (isError || !data || data.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 text-xl font-bold">Recently Tracked Playlists:</div>

      <Carousel
        opts={{
          loop: true,
        }}
        className="mx-12"
        plugins={[
          AutoScroll({
            speed: 1,
            stopOnInteraction: false,
          }),
        ]}
      >
        <CarouselContent>
          {carouselPlaylistItems.map((playlist) => (
            <CarouselItem
              key={playlist.spotifyPlaylist.id}
              className="basis-1/2 lg:basis-1/3"
            >
              <CarouselPlaylistItem
                title={playlist.spotifyPlaylist.name}
                externalPlaylistLink={
                  playlist.madeForAllPlaylist.external_urls.spotify
                }
                playlistCoverImageUrl={playlist.spotifyPlaylist.images[0].url}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
