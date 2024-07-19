import { Outlet } from 'react-router-dom';

import { Header } from './blocks';

export const DefaultLayout = () => {
  return (
    <div>
      <Header />
      <div className="p-8 sm:px-16">
        <Outlet />
      </div>
    </div>
  );
};
