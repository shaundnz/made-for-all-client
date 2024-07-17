import { MadeForAllPlaylistData, PlaylistData } from './PlaylistData';

export interface GetTrackedPlaylistResponseDto {
  spotifyPlaylist: PlaylistData;
  madeForAllPlaylist: MadeForAllPlaylistData;
}
