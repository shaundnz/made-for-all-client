import { useAllTrackedPlaylists } from '@/api/playlists';
import { TrackedPlaylistPreview } from '@/components/playlists';

export const AllTrackedPlaylistsPage = () => {
  const { isLoading, isError, data } = useAllTrackedPlaylists();

  if (isLoading) {
    return (
      <div className="flex flex-col p-8">
        <h1 className="pb-8 text-5xl font-semibold">All Tracked Playlists:</h1>
        <div className="flex flex-col space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <TrackedPlaylistPreview key={index} isLoading />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col p-8">
        <h1 className="pb-8 text-5xl font-semibold">All Tracked Playlists:</h1>
        <div>Error: Something went wrong.</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="pb-4 text-5xl font-semibold">All Tracked Playlists:</h1>
      <div className="flex flex-col space-y-4">
        {data?.map((playlist) => (
          <TrackedPlaylistPreview
            key={playlist.spotifyPlaylist.id}
            playlist={playlist}
            isLoading={false}
          />
        ))}
      </div>
    </div>
  );
};
