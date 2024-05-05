import './App.css';
import Navigations from './pages/Navigations';
import { AuthProvider } from './providers/AuthProvider';

function App() { 
  return (
    <AuthProvider>
      <Navigations />
    </AuthProvider>
  );
}

export default App;
