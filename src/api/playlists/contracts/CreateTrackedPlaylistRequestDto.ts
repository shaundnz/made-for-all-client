import { z } from 'zod';

export const CreateTrackedPlaylistRequestSchema = (
  existingPlaylistIds: string[],
) =>
  z.object({
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
      })
      .refine(
        (newId) => {
          return !existingPlaylistIds.some(
            (existingId) => existingId === newId,
          );
        },
        {
          message: 'This playlist is already tracked',
        },
      ),
  });

export type CreateTrackedPlaylistRequestDto = z.infer<
  ReturnType<typeof CreateTrackedPlaylistRequestSchema>
>;
