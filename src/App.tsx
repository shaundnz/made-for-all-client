import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mb-12 max-w-2xl space-y-4 text-center">
        <h1 className="text-5xl font-bold ">Made For All!</h1>
        <p className="mt-4 text-xl">
          Enter a &quot;Made For You&quot; Spotify playlist, and generate a
          playlist of the the original uncustomized version.
        </p>
        <form className="flex items-center space-x-2">
          <Input type="text" placeholder="Enter Spotify playlist link" />
          <Button type="submit">Generate</Button>
        </form>
      </div>
    </div>
  );
}

export default App;
