import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCreateTrackedPlaylist } from '@/api/playlists';
import { CreateTrackedPlaylistRequestSchema } from '@/api/playlists/contracts';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const LandingPage = () => {
  const [mostRecentTrackedPlaylistId, setMostRecentTrackedPlaylistId] =
    useState('');

  const form = useForm<z.infer<typeof CreateTrackedPlaylistRequestSchema>>({
    resolver: zodResolver(CreateTrackedPlaylistRequestSchema),
    defaultValues: {
      spotifyPlaylistId: '',
    },
    mode: 'all',
  });

  const createCreateTrackedPlaylistMutation = useCreateTrackedPlaylist({
    mutationConfig: {
      onSuccess: (data) => {
        setMostRecentTrackedPlaylistId(data.madeForAllPlaylist.id);
      },
    },
  });

  async function onSubmit(
    values: z.infer<typeof CreateTrackedPlaylistRequestSchema>,
  ) {
    console.log(values);
    await createCreateTrackedPlaylistMutation.mutateAsync({
      data: {
        spotifyPlaylistId: values.spotifyPlaylistId,
      },
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mb-12 max-w-2xl space-y-4 ">
        <div className="text-center">
          <h1 className="text-5xl font-bold ">Made For All!</h1>
          <p className="mt-4 text-xl">
            Enter a &quot;Made For You&quot; Spotify playlist, and generate a
            playlist of the the original, uncustomized version.
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-end space-x-2"
          >
            <FormField
              control={form.control}
              name="spotifyPlaylistId"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormLabel>Spotify playlist link</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              Track Playlist
            </Button>
          </form>
        </Form>
        {form.formState.isSubmitSuccessful && mostRecentTrackedPlaylistId}
      </div>
    </div>
  );
};
