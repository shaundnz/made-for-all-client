import { z } from 'zod';

export const CreateTrackedPlaylistRequestSchema = z.object({
  spotifyPlaylistId: z
    .string()
    .url()
    .regex(
      /^https:\/\/open\.spotify\.com\/playlist\/[A-Za-z0-9]{22}$/,
      'Not a valid Spotify playlist URL',
    )
    .transform((url) => {
      const parts = url.split('/');
      return parts[parts.length - 1];
    }),
});

export type CreateTrackedPlaylistRequestDto = z.infer<
  typeof CreateTrackedPlaylistRequestSchema
>;
