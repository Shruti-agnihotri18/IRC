import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

// Fixed top navigation bar for primary routes
function Navbar() {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <div className="brand">IRC – Indian Relief Connect</div>
        <nav className="links">
          <NavLink end to="/" className={({ isActive }) => isActive ? 'link active' : 'link'}>
            Home
          </NavLink>
          <NavLink to="/ngo" className={({ isActive }) => isActive ? 'link active' : 'link'}>
            NGO Helpline
          </NavLink>
          <NavLink to="/citizen" className={({ isActive }) => isActive ? 'link active' : 'link'}>
            Citizen Help
          </NavLink>
        </nav>
        <div className="actions">
          <button className="btn btn-muted">Login</button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

