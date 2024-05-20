import './App.css';
import Navigations from './pages/Navigations';
import { AuthProvider } from './providers/AuthProvider';
import { DepartmentProvider } from './context/DepartmentContext';
import { MeetingProvider } from './context/MeetingContext';

function App() { 
  return (
    <AuthProvider>
      <MeetingProvider>
      <DepartmentProvider>
      <Navigations />
      </DepartmentProvider>
      </MeetingProvider>
    </AuthProvider>
  );
}

export default App;
