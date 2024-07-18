import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export const NotFoundPage = () => {
  return (
    <div className="mt-52 flex flex-col items-center space-y-2">
      <h1 className="text-5xl font-bold">404 - Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Button asChild variant="link">
        <Link to="/" replace>
          Go to Home
        </Link>
      </Button>
    </div>
  );
};
