import './App.css';
import Navigations from './pages/Navigations';
import { AuthProvider } from './providers/AuthProvider';
import { DepartmentProvider } from './context/DepartmentContext';

function App() { 
  return (
    <AuthProvider>
      <DepartmentProvider>
      <Navigations />
      </DepartmentProvider>
    </AuthProvider>
  );
}

export default App;
