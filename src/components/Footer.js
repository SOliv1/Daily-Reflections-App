import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer page-fade">
      <p>© {new Date().getFullYear()} Reflections in Light</p>
    </footer>
  );
}

export default Footer;
