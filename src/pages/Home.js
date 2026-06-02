import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { heroImages } from "../components/heroImagesConfig";
import { getDailyReflection, getReflectionBlockMeta } from "../data/reflections";
import { readQuietRoomPreferences } from "../data/quietRoomPreferences";

function getRotationIndex(mode, customIndex = null) {
  const now = new Date();
  switch (mode) {
    case "daily":
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now - start;
      const day = Math.floor(diff / (1000 * 60 * 60 * 24));
      return day % heroImages.length;
    case "monthly":
      return now.getMonth() % heroImages.length;
    case "weekly":
      const startYear = new Date(now.getFullYear(), 0, 1);
      const week = Math.floor((now - startYear) / (7 * 24 * 60 * 60 * 1000));
      return week % heroImages.length;
    case "custom":
      return customIndex !== null ? customIndex : 0;
    default:
      return 0;
  }
}

function Home() {
  const [now, setNow] = useState(() => new Date());
  const [quietRoomPreferences, setQuietRoomPreferences] = useState(() => readQuietRoomPreferences());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
      setQuietRoomPreferences(readQuietRoomPreferences());
    }, 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const hour = now.getHours();

  // Restore bgClass for background styling
  let bgClass = "bg-day";
  if (hour >= 5 && hour < 12) bgClass = "bg-dawn";
  else if (hour >= 12 && hour < 17) bgClass = "bg-day";
  else if (hour >= 17 && hour < 21) bgClass = "bg-dusk";
  else bgClass = "bg-night";

  const [rotationMode, setRotationMode] = useState("weekly");
  const [customIndex, setCustomIndex] = useState(0);
  const index = getRotationIndex(rotationMode, customIndex);
  const heroImage = `${process.env.PUBLIC_URL}/images/${heroImages[index]}`;
  const heroFilename = heroImages[index];

  let textClass = "text-day";
  if (hour >= 5 && hour < 12) textClass = "text-dawn";
  else if (hour >= 12 && hour < 17) textClass = "text-day";
  else if (hour >= 17 && hour < 21) textClass = "text-dusk";
  else textClass = "text-night";

  // Determine season
  const month = new Date().getMonth(); // 0 = Jan, 11 = Dec

  let seasonClass = "season-spring";

  if (month >= 2 && month < 5) {
    seasonClass = "season-spring";   // Mar–May
  } else if (month >= 5 && month < 8) {
    seasonClass = "season-summer";   // Jun–Aug
  } else if (month >= 8 && month < 11) {
    seasonClass = "season-autumn";   // Sep–Nov
  } else {
    seasonClass = "season-winter";   // Dec–Feb
  }

  const reflection = getDailyReflection(now, quietRoomPreferences);
  const reflectionBlock = getReflectionBlockMeta(now);

  return (
    <div className={`home-container ${bgClass} ${seasonClass.replace("season", "bg")}`}>
      {/* Hero image rotation controls for preview/testing (development only) */}
      {process.env.NODE_ENV === "development" && (
        <div style={{ margin: "16px 0", textAlign: "center" }}>
          <label>
            Rotation Mode:
            <select value={rotationMode} onChange={e => setRotationMode(e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Manual</option>
            </select>
          </label>
          {rotationMode === "custom" && (
            <label style={{ marginLeft: 16 }}>
              Image:
              <select value={customIndex} onChange={e => setCustomIndex(Number(e.target.value))}>
                {heroImages.map((img, i) => (
                  <option key={img} value={i}>{img}</option>
                ))}
              </select>
            </label>
          )}
          <p className="testing-muted">Currently showing: {heroFilename}</p>
        </div>
      )}

      <img
        src={heroImage}
        alt="Soft Forest light"
        className={`home-hero hero-shimmer ${seasonClass.replace("season", "hero")}`}
      />
      <div className="home-orb-small"></div>


      <h1 className={`home-title ${textClass} ${seasonClass}`}>Daily Orb Reflections</h1>

      <p className={`home-subtitle ${textClass} ${seasonClass}`}>
        A daily moment of clarity from the Reflections in Light family
      </p>


      <blockquote className={`seasonal-quotes
         ${textClass} ${seasonClass}`}>
        {reflection.line}
      </blockquote>

      <p className={`home-reflection-meta ${textClass} ${seasonClass}`}>
        {reflectionBlock.label} · {reflectionBlock.orb} · {reflection.title}
      </p>

      <nav className="home-links">
        <Link to="/today" className="home-link">Today</Link>
        <Link to="/favourites" className="home-link">Favourites</Link>
        <Link to="/about" className="home-link">About</Link>
      </nav>

    </div>
  );
}

export default Home;
