import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Navigation from './components/layout/Navigation';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import History from './pages/History';
import Settings from './pages/Settings';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-black text-white">
          <Routes>
            {/* Landing page without navigation */}
            <Route path="/" element={<Landing />} />
            
            {/* Pages with navigation */}
            <Route
              path="/*"
              element={
                <>
                  <Navigation />
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/results/:id" element={<Results />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </>
              }
            />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;

// Made with Bob
