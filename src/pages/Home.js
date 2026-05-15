import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const hour = new Date().getHours();

  let orbClass = "orb-day"; // default

  if (hour >= 5 && hour < 10) orbClass = "orb-dawn";
  else if (hour >= 10 && hour < 17) orbClass = "orb-light";
  else if (hour >= 17 && hour < 20) orbClass = "orb-dusk";
  else orbClass = "orb-night";

  let bgClass = "bg-day";

  if (hour >= 5 && hour < 10) bgClass = "bg-dawn";
  else if (hour >= 10 && hour < 17) bgClass = "bg-light";
  else if (hour >= 17 && hour < 20) bgClass = "bg-dusk";
  else bgClass = "bg-night";

  let textClass = "text-day";

  if (hour >= 5 && hour < 10) textClass = "text-dawn";
  else if (hour >= 10 && hour < 17) textClass = "text-day";
  else if (hour >= 17 && hour < 20) textClass = "text-dusk";
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

  const seasonalQuotes = {
  "season-spring": [
    "New light finds its way in quiet moments.",
    "Clarity grows where gentleness begins."
  ],
  "season-summer": [
    "Warmth softens the edges of the day.",
    "A bright moment can shift everything."
  ],
  "season-autumn": [
    "Let the day settle into something softer.",
    "Evening light carries its own kind of clarity."
  ],
  "season-winter": [
    "Stillness reveals what we often overlook.",
    "A quiet moment can warm the whole day."
  ]
};

  const quoteList = seasonalQuotes[seasonClass];
  const quote = quoteList[Math.floor(Math.random() * quoteList.length)];



  return (
    <div className={`home-container ${bgClass} ${seasonClass.replace("season", "bg")}`}>


    <div className={`home-orb ${orbClass}`}>

    </div>

      <img
        src={process.env.PUBLIC_URL + "/images/hero.jpg"}
        alt="Soft light"
        className={`home-hero hero-shimmer ${seasonClass.replace("season", "hero")}`}
      />
      <div className="home-orb-small"></div>


      <h1 className={`home-title ${textClass} ${seasonClass}`}>Daily Orb Reflections</h1>

      <p className={`home-subtitle ${textClass} ${seasonClass}`}>
        A daily moment of clarity from the Reflections in Light family
      </p>


      <blockquote className={`home-quote ${textClass} ${seasonClass}`}>
        {quote}
      </blockquote>

      <nav className="home-links">
        <Link to="/today" className="home-link">Today</Link>
        <Link to="/favourites" className="home-link">Favourites</Link>
        <Link to="/about" className="home-link">About</Link>
      </nav>

    </div>
  );
}

export default Home;