import React from 'react';
import { Link } from 'react-router';
import Navbar from '../Navbar/Navbar';
import '../../../styles/main.css';

const Header = () => {
  return (
    <header className="header-pill-container">
      <div className="header-pill-content">
        {/* Logo cliquable vers la homepage */}
        <Link
          to="/"
          className="navbar-logo cursor-pointer"
          aria-label="Retour à la page d'accueil"
        >
          MARS<span className="gradient-text">AI</span>
        </Link>

        {/* Navbar (Icons) */}
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
