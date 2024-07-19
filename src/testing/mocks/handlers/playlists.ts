import { http, HttpResponse } from 'msw';

import { env } from '@/config/env';
import { createMadeForAllPlaylist } from '@/testing/dataGenerators';

import { db, persistDb } from '../db';
import { withDelay } from '../middleware';

export const playlistHandlers = [
  http.get(
    `${env.API_BASE_URL}/playlists`,
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
    `${env.API_BASE_URL}/playlists`,
    withDelay(async ({ request }) => {
      try {
        const { spotifyPlaylistId } = (await request.json()) as {
          spotifyPlaylistId: string;
        };

        const playlist = db.playlist.findFirst({
          where: {
            spotifyPlaylist: {
              id: {
                equals: spotifyPlaylistId,
              },
            },
          },
        });

        if (playlist) {
          return HttpResponse.json(
            { message: `Playlist Id: ${spotifyPlaylistId} is already tracked` },
            { status: 409 },
          );
        }

        const result = db.playlist.create(
          createMadeForAllPlaylist({
            spotifyPlaylist: { id: spotifyPlaylistId },
          }),
        );
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
    `${env.API_BASE_URL}/playlists`,
    withDelay(async ({ request }) => {
      try {
        const { spotifyPlaylistId } = (await request.json()) as {
          spotifyPlaylistId: string;
        };

        const playlist = db.playlist.findFirst({
          where: {
            spotifyPlaylist: {
              id: {
                equals: spotifyPlaylistId,
              },
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
    `${env.API_BASE_URL}/playlists/:id`,
    withDelay(({ params }) => {
      try {
        const spotifyPlaylistId = params.id as string;

        const playlist = db.playlist.findFirst({
          where: {
            spotifyPlaylist: {
              id: {
                equals: spotifyPlaylistId,
              },
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
    `${env.API_BASE_URL}/playlists/:id`,
    withDelay(({ params }) => {
      try {
        const spotifyPlaylistId = params.id as string;

        const playlist = db.playlist.findFirst({
          where: {
            spotifyPlaylist: {
              id: {
                equals: spotifyPlaylistId,
              },
            },
          },
        });

        if (!playlist) {
          return HttpResponse.json({ status: 404 });
        }

        db.playlist.delete({
          where: {
            spotifyPlaylist: {
              id: {
                equals: spotifyPlaylistId,
              },
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
