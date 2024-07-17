import { render, RenderOptions, RenderResult } from '@testing-library/react';

import { AppProvider } from '@/app/AppProvider';

export const renderWithContext = (
  ui: React.ReactNode,
  { ...renderOptions }: Omit<RenderOptions, 'queries'> = {},
): RenderResult => {
  const returnValue = {
    ...render(ui, {
      wrapper: AppProvider,
      ...renderOptions,
    }),
  };

  return returnValue;
};
