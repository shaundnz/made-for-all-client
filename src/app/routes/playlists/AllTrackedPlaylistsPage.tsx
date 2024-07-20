import { Search } from 'lucide-react';
import React from 'react';

import { useAllTrackedPlaylists } from '@/api/playlists';
import { Pagination } from '@/components/Pagination';
import { TrackedPlaylistPreview } from '@/components/playlists';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAllTrackedPlaylistPage } from '@/features/allTrackedPlaylists/hooks';
import { PlaylistsFilterType, PlaylistsFilterOrder } from '@/hooks';

const TRACKED_PLAYLISTS_PER_PAGE = 4;

export const AllTrackedPlaylistsPage = () => {
  const [playlistsSearchInputValue, setPlaylistsSearchInputValue] =
    React.useState('');

  const [playlistsFilterType, setPlaylistsFilterType] = React.useState(
    PlaylistsFilterType.CreatedAt,
  );
  const [playlistsFilterOrder, setPlaylistsFilterOrder] = React.useState(
    PlaylistsFilterOrder.Descending,
  );

  const { isLoading, isError, data } = useAllTrackedPlaylists();

  const {
    hasPreviousPage,
    hasNextPage,
    currentPage,
    totalPages,
    incrementPage,
    decrementPage,
    paginatedItems: paginatedPlaylists,
  } = useAllTrackedPlaylistPage(
    data ? data : [],
    TRACKED_PLAYLISTS_PER_PAGE,
    playlistsSearchInputValue,
    playlistsFilterType,
    playlistsFilterOrder,
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <AllTrackedPlaylistsPageHeader />
        <div
          className="flex flex-col space-y-4"
          data-testid="all-tracked-playlists-loading-skeleton"
        >
          {Array.from({ length: TRACKED_PLAYLISTS_PER_PAGE }).map(
            (_, index) => (
              <TrackedPlaylistPreview key={index} isLoading />
            ),
          )}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <AllTrackedPlaylistsPageHeader />
        <div>Error: Something went wrong.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AllTrackedPlaylistsPageHeader />
      <div className="flex flex-col space-x-1 sm:flex-row">
        <div className="min-w-64">
          <Label htmlFor="search">Search Playlists</Label>
          <Input
            type="text"
            id="search"
            placeholder="Search Playlists"
            value={playlistsSearchInputValue}
            onChange={(e) => setPlaylistsSearchInputValue(e.target.value)}
            endIcon={Search}
          />
        </div>

        <div className="flex space-x-1">
          <div className="min-w-32 grow">
            <Label htmlFor="sortBy">Sort By</Label>
            <Select
              value={playlistsFilterType}
              onValueChange={(value: PlaylistsFilterType) =>
                setPlaylistsFilterType(value)
              }
            >
              <SelectTrigger id="sortBy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PlaylistsFilterType.CreatedAt}>
                  Created At
                </SelectItem>
                <SelectItem value={PlaylistsFilterType.Title}>Title</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-32 grow">
            <Label htmlFor="filterBy">Order By</Label>
            <Select
              value={playlistsFilterOrder}
              onValueChange={(value: PlaylistsFilterOrder) =>
                setPlaylistsFilterOrder(value)
              }
            >
              <SelectTrigger id="filterBy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PlaylistsFilterOrder.Ascending}>
                  Ascending
                </SelectItem>
                <SelectItem value={PlaylistsFilterOrder.Descending}>
                  Descending
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {paginatedPlaylists.length > 0 ? (
        <>
          <div className="flex flex-col">
            {paginatedPlaylists.map((playlist, index) => (
              <div key={playlist.spotifyPlaylist.id}>
                <TrackedPlaylistPreview
                  playlist={playlist}
                  isLoading={false}
                  showCreatedDate
                />
                {index < paginatedPlaylists.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onNextClick={incrementPage}
            onPreviousClick={decrementPage}
          />
        </>
      ) : (
        <div className="text-xl font-semibold">No Results Found</div>
      )}
    </div>
  );
};

const AllTrackedPlaylistsPageHeader = () => {
  return <h1 className="text-5xl font-semibold">All Tracked Playlists:</h1>;
};
