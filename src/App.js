import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import NgoPage from './pages/NgoPage';
import CitizenPage from './pages/CitizenPage';

// App is the root of the application. It sets up routing and global layout.
// We keep the Navbar always visible and switch the main content based on the route.
function App() {
  return (
    <div className="App">
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ngo" element={<NgoPage />} />
          <Route path="/citizen" element={<CitizenPage />} />
          <Route path="*" element={<div style={{ padding: 24 }}>Page not found. Go <NavLink to="/">Home</NavLink>.</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

