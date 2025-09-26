import { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './pages/LandingPage.jsx';
import Dashboard from './pages/Dashboard.jsx';

function PageTransitionWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    document.documentElement.style.backgroundColor = '#0A2A4E';
  }, []);

  return (
    <div className="min-h-screen bg-deepBlue text-pure">
      <header className="sticky top-0 z-40 bg-deepBlue/70 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan shadow-glow" />
            <span>IRC – IndianReliefConnect</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link className="hover:text-cyan transition-colors" to="/">Home</Link>
            <Link className="hover:text-cyan transition-colors" to="/dashboard">Dashboard</Link>
          </nav>
        </div>
      </header>
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="p-8">Loading...</div>}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={<PageTransitionWrapper><LandingPage /></PageTransitionWrapper>}
            />
            <Route
              path="/dashboard"
              element={<PageTransitionWrapper><Dashboard /></PageTransitionWrapper>}
            />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </div>
  );
}
