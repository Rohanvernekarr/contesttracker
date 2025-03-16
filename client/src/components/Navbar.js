import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Contest Tracker</Link>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start">
          <Link to="/" className="navbar-item">Home</Link>
          <Link to="/bookmarks" className="navbar-item">Bookmarks</Link>
          <Link to="/admin" className="navbar-item">Admin</Link>
        </div>
        <div className="navbar-end">
          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;