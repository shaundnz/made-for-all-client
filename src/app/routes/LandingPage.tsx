import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  useAllTrackedPlaylists,
  useCreateTrackedPlaylist,
} from '@/api/playlists';
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
import {
  TrackedPlaylistPreview,
  RecentTrackedPlaylistsCarousel,
} from '@/features/landingPage/components';
import {
  TrackedPlaylistViewState,
  useTrackedPlaylistPreview,
} from '@/features/landingPage/hooks/useTrackedPlaylistPreview.hook';

export const LandingPage = () => {
  const allTrackedPlaylistsQuery = useAllTrackedPlaylists();
  const { isLoading, data } = allTrackedPlaylistsQuery;

  const allPlaylistIds = React.useMemo(() => {
    if (isLoading || !data) {
      return [];
    }

    return data.map((trackedPlaylists) => trackedPlaylists.spotifyPlaylist.id);
  }, [data, isLoading]);

  const form = useForm<
    z.infer<ReturnType<typeof CreateTrackedPlaylistRequestSchema>>
  >({
    resolver: zodResolver(CreateTrackedPlaylistRequestSchema(allPlaylistIds)),
    defaultValues: {
      spotifyPlaylistId: '',
    },
    mode: 'all',
  });

  const spotifyPlaylistIdFieldInputValue = useWatch({
    control: form.control,
    name: 'spotifyPlaylistId',
  });

  const trackedPlaylistPreview = useTrackedPlaylistPreview({
    allPlaylistsLoading: isLoading,
    allPlaylistsData: data ? data : [],
    inputPlaylistIdValue: spotifyPlaylistIdFieldInputValue,
    formSubmitted: form.formState.isSubmitted,
    formSubmitting: form.formState.isSubmitting,
    formSubmittedSuccessfully: form.formState.isSubmitSuccessful,
  });

  const createCreateTrackedPlaylistMutation = useCreateTrackedPlaylist();

  const onSubmit = async (
    values: z.infer<ReturnType<typeof CreateTrackedPlaylistRequestSchema>>,
  ) => {
    try {
      const res = await createCreateTrackedPlaylistMutation.mutateAsync({
        data: {
          spotifyPlaylistId: values.spotifyPlaylistId,
        },
      });

      trackedPlaylistPreview.setMostRecentlyTrackedPlaylist(res);
    } catch (err) {
      toast.error('Something went wrong.');
    }
  };

  const getNewTrackedPlaylistComponent = () => {
    switch (trackedPlaylistPreview.trackedPlaylistViewState) {
      case TrackedPlaylistViewState.None: {
        return null;
      }
      case TrackedPlaylistViewState.Loading: {
        return <TrackedPlaylistPreview isLoading />;
      }
      case TrackedPlaylistViewState.NewTrackedPlaylist:
      case TrackedPlaylistViewState.PreviouslyTrackedPlaylist: {
        return (
          <TrackedPlaylistPreview
            isLoading={false}
            playlist={trackedPlaylistPreview.trackedPlaylist}
          />
        );
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8">
      <div className="mb-12 w-full max-w-2xl space-y-4">
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
            className="flex flex-col space-y-2 md:flex-row md:items-end md:space-x-2"
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
            <div>
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
                className={`${form.getFieldState('spotifyPlaylistId').error && 'md:mb-7'} w-full`}
              >
                Track Playlist
              </Button>
            </div>
          </form>
        </Form>
        {getNewTrackedPlaylistComponent()}
        <div className="pt-8">
          <RecentTrackedPlaylistsCarousel />
        </div>
      </div>
    </div>
  );
};
