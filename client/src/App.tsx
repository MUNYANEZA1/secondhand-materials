
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { ThemeProvider } from './components/providers/ThemeProvider';

// Pages
import Index from './pages/Index';
import Events from './pages/Events';
import Services from './pages/Services';
import Rooms from './pages/Rooms';
import Rides from './pages/Rides';
import Resources from './pages/Resources';
import StudyGroups from './pages/StudyGroups';
import Tutoring from './pages/Tutoring';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminPortal from './pages/AdminPortal';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/events" element={<Events />} />
                <Route path="/services" element={<Services />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/rides" element={<Rides />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/study-groups" element={<StudyGroups />} />
                <Route path="/tutoring" element={<Tutoring />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin-portal" element={<AdminPortal />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster position="bottom-right" />
            </div>
          </Router>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
