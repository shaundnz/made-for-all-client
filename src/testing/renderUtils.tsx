import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { AppProvider } from '@/app/AppProvider';

export const renderWithContext = (
  ui: React.ReactNode,
  {
    url = '/',
    path = '/',
    ...renderOptions
  }: RenderOptions & { url?: string; path?: string } = {},
): RenderResult => {
  const router = createMemoryRouter(
    [
      {
        path: path,
        element: ui,
      },
    ],
    {
      initialEntries: url ? ['/', url] : ['/'],
      initialIndex: url ? 1 : 0,
    },
  );

  const returnValue = {
    ...render(ui, {
      wrapper: () => (
        <AppProvider>
          <RouterProvider router={router} />
        </AppProvider>
      ),
      ...renderOptions,
    }),
  };

  return returnValue;
};
