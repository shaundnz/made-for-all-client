import { PlaylistData } from './PlaylistData';

export interface CreateTrackedPlaylistResponseDto {
  spotifyPlaylist: PlaylistData;
  madeForAllPlaylist: PlaylistData;
}
