import {
  randPhrase,
  randNumber,
  randUuid,
  randCatchPhrase,
  randAlpha,
} from '@ngneat/falso';

import { CreateTrackedPlaylistResponseDto } from '@/api/playlists/contracts';

type DeepPartial<K> = {
  [attr in keyof K]?: K[attr] extends object
    ? DeepPartial<K[attr]>
    : K[attr] extends object | null
      ? DeepPartial<K[attr]> | null
      : K[attr] extends object | null | undefined
        ? DeepPartial<K[attr]> | null | undefined
        : K[attr];
};

export const generateMadeForAllPlaylist = ({
  spotifyPlaylistId = randUuid(),
  name = randCatchPhrase(),
  madeForAllPlaylistId = randUuid(),
} = {}): CreateTrackedPlaylistResponseDto => {
  const shared = {
    collaborative: false,
    description: randPhrase(),
    images: [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67706f00000002022ac93601f8f6b558b39dc2',
        width: 640,
      },
    ],
    primary_color: '#ffffff',
    public: true,
    type: 'playlist',
  };

  return {
    spotifyPlaylist: {
      ...shared,
      external_urls: {
        spotify: `https://open.spotify.com/playlist/${spotifyPlaylistId}`,
      },
      followers: {
        href: null,
        total: randNumber(),
      },
      href: `https://open.spotify.com/playlist/${spotifyPlaylistId}`,
      id: spotifyPlaylistId,
      name: name,
      owner: {
        display_name: 'Spotify',
        external_urls: {
          spotify: 'https://open.spotify.com/user/spotify',
        },
        href: 'https://api.spotify.com/v1/users/spotify',
        id: 'spotify',
        type: 'user',
        uri: 'spotify:user:spotify',
      },
      snapshot_id: randAlpha({ length: 20 }).join(''),
      uri: `spotify:playlist:${spotifyPlaylistId}`,
    },
    madeForAllPlaylist: {
      ...shared,
      createdAt: new Date().toISOString(),
      external_urls: {
        spotify: `https://open.spotify.com/playlist/${madeForAllPlaylistId}`,
      },
      followers: {
        href: null,
        total: randNumber(),
      },
      href: `https://open.spotify.com/playlist/${madeForAllPlaylistId}`,
      id: madeForAllPlaylistId,
      name: `MadeForAll - ${name}`,
      owner: {
        href: 'https://api.spotify.com/v1/users/31bowcqwxwyhoxvonqpfuhj3azjm',
        id: '31bowcqwxwyhoxvonqpfuhj3azjm',
        type: 'user',
        uri: 'spotify:user:31bowcqwxwyhoxvonqpfuhj3azjm',
        display_name: 'MadeForAll',
        external_urls: {
          spotify: 'https://open.spotify.com/user/31bowcqwxwyhoxvonqpfuhj3azjm',
        },
      },
      snapshot_id: randAlpha({ length: 20 }).join(''),
      uri: `spotify:playlist:${madeForAllPlaylistId}`,
    },
  };
};

export const createMadeForAllPlaylist = <
  T extends DeepPartial<ReturnType<typeof generateMadeForAllPlaylist>>,
>(
  overrides?: T,
) => {
  const madeForAllPlaylist = generateMadeForAllPlaylist({
    spotifyPlaylistId: overrides?.spotifyPlaylist?.id,
    name: overrides?.spotifyPlaylist?.name,
    madeForAllPlaylistId: overrides?.madeForAllPlaylist?.id,
  });

  return {
    ...madeForAllPlaylist,
    madeForAllPlaylist: {
      ...madeForAllPlaylist.madeForAllPlaylist,
      ...overrides?.madeForAllPlaylist,
    },
    spotifyPlaylist: {
      ...madeForAllPlaylist.spotifyPlaylist,
      ...overrides?.spotifyPlaylist,
    },
  };
};
