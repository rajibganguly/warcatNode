import './App.css';
import '../src/assets/style/sass/app.scss';
import Navigations from './pages/Navigations';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider } from './providers/AuthProvider';
import { MeetingProvider } from './context/MeetingContext';
import { DepartmentProvider } from './context/DepartmentContext';
import imageAP from './assets/logo-dark-sm-removebg-preview.png'

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
