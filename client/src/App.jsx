import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import TripPlanner from './components/planner/TripPlanner';
import Dashboard from './components/dashboard/Dashboard';
import AuthModal from './components/auth/AuthModal';
import { useStore } from './store/useStore';
import { useEffect } from 'react';

function App() {
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
        <Navbar />
        <main className="flex-grow flex flex-col pt-16">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/planner" element={<TripPlanner />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
        <AuthModal />
      </div>
    </Router>
  );
}

export default App;
