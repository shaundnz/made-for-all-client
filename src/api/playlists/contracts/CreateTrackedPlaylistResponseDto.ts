import { MadeForAllPlaylistData, PlaylistData } from './PlaylistData';

export interface CreateTrackedPlaylistResponseDto {
  spotifyPlaylist: PlaylistData;
  madeForAllPlaylist: MadeForAllPlaylistData;
}
