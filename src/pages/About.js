import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-container page-fade">
      <h1 className="about-title">About</h1>

      <p className="about-text">
        Daily Orb is a simple tool for daily reflection.
      </p>

      <p className="about-text">
        Each entry includes one image, one line, and one mood. The goal is
        clarity, not complexity.
      </p>

      <p className="about-text">
        Save reflections that resonate. Return to them when you need a reset.
      </p>

      <p className="about-credit">
        Designed for calm, focus, and emotional clarity.
      </p>
    </div>
  );
}

export default About;
