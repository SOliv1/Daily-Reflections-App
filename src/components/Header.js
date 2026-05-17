import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-title">
        Reflections in Light
      </Link>

      <nav className="header-nav">
        <Link to="/today" className="header-link">Today</Link>
        <Link to="/favourites" className="header-link">Favourites</Link>
        <Link to="/testing" className="header-link">Testing</Link>
        <Link to="/about" className="header-link">About</Link>
      </nav>
    </header>
  );
}

export default Header;
