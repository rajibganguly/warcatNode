import './App.css';
import Navigations from './pages/Navigations';
import { AuthProvider } from './providers/AuthProvider';
import { DepartmentProvider } from './context/DepartmentContext';
import { MeetingProvider } from './context/MeetingContext';
import { TaskProvider } from './context/TaskContext';

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <MeetingProvider>
          <DepartmentProvider>
            <Navigations />
          </DepartmentProvider>
        </MeetingProvider>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
