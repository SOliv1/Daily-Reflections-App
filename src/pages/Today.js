import React from "react";
 import { Link } from "react-router-dom";
import { getDailyReflection } from "../data/reflections";
import HeartButton from "../components/HeartButton";
import "./Today.css";

function Today() {
  const reflection = getDailyReflection();

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
