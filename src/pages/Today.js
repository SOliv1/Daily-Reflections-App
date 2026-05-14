import React from "react";
 import { Link } from "react-router-dom";
import reflections from "../data/reflections";
import HeartButton from "../components/HeartButton";
import "./Today.css";

function Today() {
  // Get today's day index (0–6)
  const todayIndex = new Date().getDay(); // Sunday = 0, Monday = 1, etc.

  // Map Sunday (0) → reflection 1, Monday (1) → reflection 2, etc.
  const reflection = reflections[todayIndex];

  if (!reflection) {
    return <p>No reflection found for today.</p>;
  }

  return (
    <div className="today-container page-fade">

      <Link to="/" className="return-button">← Home</Link>

      <img
        src={reflection.image}
        alt={reflection.title}
        className="today-image"

      />

      <h1 className="today-title">{reflection.title}</h1>

      <p className="today-line">{reflection.line}</p>

      <p className="today-mood">Mood: {reflection.mood}</p>

      <HeartButton reflectionId={reflection.id} />

    </div>
  );
}

export default Today;
