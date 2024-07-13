import { AppProvider } from './AppProvider';
import { LandingPage } from './routes/LandingPage';

const App = () => {
  return (
    <AppProvider>
      <LandingPage />
    </AppProvider>
  );
};

export default App;
