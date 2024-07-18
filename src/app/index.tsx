import React from 'react';
import { RouterProvider } from 'react-router-dom';

import { AppProvider } from './AppProvider';
import { createRouter } from './routes';

const AppRouter = () => {
  const router = React.useMemo(() => createRouter(), []);

  return <RouterProvider router={router} />;
};

const App = () => {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
};

export default App;
