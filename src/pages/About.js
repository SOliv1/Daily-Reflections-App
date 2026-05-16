import React from "react";
import "./About.css";
import ContactBlock from '../components/ContactBlock';


function About() {
  return (
    <div className="about-container page-fade">
      <h1 className="about-title">About</h1>

      <p className="about-text">
        Daily Orb: Reflections is part of the Reflections in Light family, a collection of calm, intentional digital spaces designed to support clarity, emotional rhythm, and gentle daily practice.
      </p>

      <p className="about-text">
        Daily Orb: Reflections is shaped around three principles:
      </p>

      <ol className="about-list">
        <li className="about-list-item">
          <span className="about-list-marker">01</span>
          <div>
            <strong>Clarity</strong>
            <p>A single thought, delivered without clutter. A moment that stands on its own.</p>
          </div>
        </li>

        <li className="about-list-item">
          <span className="about-list-marker">02</span>
          <div>
            <strong>Continuity</strong>
            <p>A rhythm you can trust. A daily return to centre.</p>
          </div>
        </li>

        <li className="about-list-item">
          <span className="about-list-marker">03</span>
          <div>
            <strong>Lightness</strong>
            <p>A design that stays out of the way. Soft colour, minimal structure, and a sense of breathing room.</p>
          </div>
        </li>
      </ol>


      <p className="about-credit">
        Designed for calm, focus, and emotional clarity.
      </p>
      <p className="about-credit">As part of the Reflections in Light family, this app is one expression of a wider intention: creating digital spaces that feel peaceful, spacious, and emotionally safe. More projects will join this family over time, each with its own focus but sharing the same quiet ethos.</p>
      <p className="about-credit">Thank you for being here and for making space for reflection in your day.</p>
      <ContactBlock />
    </div>

  );
}

export default About;
