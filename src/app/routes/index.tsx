import { createBrowserRouter } from 'react-router-dom';

import { DefaultLayout, LandingPageLayout } from '@/components/layouts';

import { LandingPage } from './LandingPage';
import { NotFoundPage } from './NotFoundPage';
import { AllTrackedPlaylistsPage } from './playlists/AllTrackedPlaylistsPage';

export const createRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <LandingPageLayout />,
      children: [
        {
          path: '/',
          element: <LandingPage />,
        },
      ],
    },
    {
      element: <DefaultLayout />,
      children: [
        {
          path: '/playlists',
          element: <AllTrackedPlaylistsPage />,
        },
        {
          path: '*',
          element: <NotFoundPage />,
        },
      ],
    },
  ]);
