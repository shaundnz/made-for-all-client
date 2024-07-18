import { Outlet } from 'react-router-dom';

export const LandingPageLayout = () => {
  return (
    <div className="mt-32 flex flex-col items-center px-8 ">
      <div className="w-full max-w-2xl space-y-4">
        <Outlet />
      </div>
    </div>
  );
};
