import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Toaster } from '@/components/ui/sonner';
import { getQueryClient } from '@/lib/reactQuery';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {import.meta.env.DEV && <ReactQueryDevtools />}
      {children}
      <Toaster richColors toastOptions={{}} />
    </QueryClientProvider>
  );
};
