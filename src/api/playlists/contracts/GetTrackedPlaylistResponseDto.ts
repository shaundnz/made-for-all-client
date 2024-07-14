import { PlaylistData } from './PlaylistData';

export interface GetTrackedPlaylistResponseDto {
  spotifyPlaylist: PlaylistData;
  madeForAllPlaylist: PlaylistData;
}
