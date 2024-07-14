import { PlaylistData } from './PlaylistData';

export type GetAllTrackedPlaylistResponseDto = {
  spotifyPlaylist: PlaylistData;
  madeForAllPlaylist: PlaylistData;
}[];
