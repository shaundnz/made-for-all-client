import { http, HttpResponse } from 'msw';

import { env } from '@/config/env';

import { db, persistDb } from '../db';
import { withDelay } from '../middleware';

export const playlistHandlers = [
  http.get(
    `${env.MADE_FOR_ALL_API_BASE_URL}/playlists`,
    withDelay(() => {
      try {
        const playlists = db.playlist.getAll();
        return HttpResponse.json(playlists);
      } catch (error: any) {
        return HttpResponse.json(
          { message: error?.message || 'Server Error' },
          { status: 500 },
        );
      }
    }),
  ),

  http.post(
    `${env.MADE_FOR_ALL_API_BASE_URL}/playlists`,
    withDelay(async ({ request }) => {
      try {
        const { spotifyPlaylistId } = (await request.json()) as {
          spotifyPlaylistId: string;
        };

        const playlist = db.playlist.findFirst({
          where: {
            spotifyPlaylistId: {
              equals: spotifyPlaylistId,
            },
          },
        });

        if (playlist) {
          return HttpResponse.json(
            { message: `Playlist Id: ${spotifyPlaylistId} is already tracked` },
            { status: 409 },
          );
        }

        const result = db.playlist.create({
          spotifyPlaylistId: spotifyPlaylistId,
        });
        await persistDb('playlist');
        return HttpResponse.json(result);
      } catch (error: any) {
        return HttpResponse.json(
          { message: error?.message || 'Server Error' },
          { status: 500 },
        );
      }
    }),
  ),

  http.put(
    `${env.MADE_FOR_ALL_API_BASE_URL}/playlists`,
    withDelay(async ({ request }) => {
      try {
        const { spotifyPlaylistId } = (await request.json()) as {
          spotifyPlaylistId: string;
        };

        const playlist = db.playlist.findFirst({
          where: {
            spotifyPlaylistId: {
              equals: spotifyPlaylistId,
            },
          },
        });

        if (!playlist) {
          return HttpResponse.json(
            { message: `Playlist Id: ${spotifyPlaylistId} is not tracked` },
            { status: 404 },
          );
        }

        await persistDb('playlist');
        return HttpResponse.json(playlist);
      } catch (error: any) {
        return HttpResponse.json(
          { message: error?.message || 'Server Error' },
          { status: 500 },
        );
      }
    }),
  ),

  http.get(
    `${env.MADE_FOR_ALL_API_BASE_URL}/playlists/:id`,
    withDelay(({ params }) => {
      try {
        const playlistId = params.id as string;

        const playlist = db.playlist.findFirst({
          where: {
            spotifyPlaylistId: {
              equals: playlistId,
            },
          },
        });

        if (!playlist) {
          return HttpResponse.json({ status: 404 });
        }

        return HttpResponse.json(playlist);
      } catch (error: any) {
        return HttpResponse.json(
          { message: error?.message || 'Server Error' },
          { status: 500 },
        );
      }
    }),
  ),

  http.delete(
    `${env.MADE_FOR_ALL_API_BASE_URL}/playlists/:id`,
    withDelay(({ params }) => {
      try {
        const playlistId = params.id as string;

        const playlist = db.playlist.findFirst({
          where: {
            spotifyPlaylistId: {
              equals: playlistId,
            },
          },
        });

        if (!playlist) {
          return HttpResponse.json({ status: 404 });
        }

        db.playlist.delete({
          where: {
            spotifyPlaylistId: {
              equals: playlistId,
            },
          },
        });

        return HttpResponse.json({
          message: 'Playlist Deleted',
        });
      } catch (error: any) {
        return HttpResponse.json(
          { message: error?.message || 'Server Error' },
          { status: 500 },
        );
      }
    }),
  ),
];
