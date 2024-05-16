import './App.css';
import Navigations from './pages/Navigations';
import { AuthProvider } from './providers/AuthProvider';
import { Provider } from 'react-redux'; // Import Provider from react-redux
import { store } from './store'; // Assuming you have a Redux store set up

function App() { 
  return (
    <Provider store={store}>
      <AuthProvider>
        <Navigations />
      </AuthProvider>
    </Provider>
  );
}

export default App;
