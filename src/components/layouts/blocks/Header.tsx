import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const Header = () => {
  return (
    <div>
      <div className="flex items-center justify-between px-8 py-2">
        <div className="text-2xl font-bold">MadeForAll</div>
        <Button asChild variant="link">
          <Link to="/">Home</Link>
        </Button>
      </div>
      <Separator />
    </div>
  );
};
