import { Outlet } from 'react-router-dom';

import { Header } from './blocks';

export const DefaultLayout = () => {
  return (
    <div>
      <Header />
      <div className="px-16 py-8">
        <Outlet />
      </div>
    </div>
  );
};
