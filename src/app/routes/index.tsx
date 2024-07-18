import { createBrowserRouter } from 'react-router-dom';

import { LandingPage } from './LandingPage';
import { NotFoundPage } from './NotFoundPage';
import { AllTrackedPlaylistsPage } from './playlists/AllTrackedPlaylistsPage';

export const createRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      Component: LandingPage,
    },
    {
      path: '/playlists',
      Component: AllTrackedPlaylistsPage,
    },
    {
      path: '*',
      Component: NotFoundPage,
    },
  ]);
