import React from 'react';
import { Link } from 'react-router';
import Navbar from '../Navbar/Navbar';
import '../../../styles/main.css';
import { useLanguage } from '../../../context/LanguageContext';
import LanguageSwitch from './LanguageSwitch';

const Header = () => {
  const { language } = useLanguage();
  const { setLanguage } = useLanguage();
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

        {/* Language Switch Button */}
        {/* <button
          className="language-switch-button"
          onClick={() => {
            language === 'fr' ? setLanguage('en') : setLanguage('fr');
          }}
        >
          <Globe size={22} strokeWidth={1.5} className="text-white" />
          <span className="text-white">{language === 'fr' ? 'FR' : 'EN'}</span>
        </button> */}
        <LanguageSwitch language={language} setLanguage={setLanguage} />

      </div>
    </header>
  );
};

export default Header;
