import React from "react";
import "./Footer.css";

const DAILY_ORB_URL = "https://soliv1.github.io/Daily-Reflections-App/";
const CENTRE_NOTES_URL = "https://centre-notes.netlify.app/";
const SEASONAL_MIND_SPACE_URL = "https://soliv1.github.io/Seasonal-mind-space/";
const SEASONAL_STUDIO_URL = "https://seasonal.studio/studio/about";

function getReturnUrl() {
  if (typeof window === "undefined") {
    return SEASONAL_STUDIO_URL;
  }

  const params = new URLSearchParams(window.location.search);
  return params.get("returnTo") || SEASONAL_STUDIO_URL;
}

function withReturn(url) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}from=daily-reflections&returnTo=${encodeURIComponent(DAILY_ORB_URL)}`;
}

function Footer() {
  const returnUrl = getReturnUrl();

  return (
    <footer className="footer page-fade">
      <p>Daily Orb Reflections - © 2026 Reflections in Light: Part of the Reflections in Light Family</p>
      <nav className="footer-return-nav" aria-label="Return and companion spaces">
        <a href={returnUrl}>Return to Seasonal Studio</a>
        <a href={withReturn(CENTRE_NOTES_URL)}>Open Centre Notes</a>
        <a href={withReturn(SEASONAL_MIND_SPACE_URL)}>Open Seasonal Mind Space</a>
      </nav>
    </footer>
  );
}

export default Footer;
