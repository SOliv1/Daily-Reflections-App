import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getDailyReflection, getReflectionBlockMeta } from "../data/reflections";
import { readQuietRoomPreferences } from "../data/quietRoomPreferences";
import HeartButton from "../components/HeartButton";
import "./Today.css";

function Today() {
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get("date");
  const selectedDate = dateParam ? new Date(`${dateParam}T12:00:00`) : new Date();
  const quietRoomPreferences = readQuietRoomPreferences();
  const reflection = getDailyReflection(selectedDate, quietRoomPreferences);
  const reflectionBlock = getReflectionBlockMeta(selectedDate);

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

      <p className="today-block">
        {reflectionBlock.label} · {reflectionBlock.orb} · {reflectionBlock.category}
      </p>

      <p className="today-mood">Mood: {reflection.mood}</p>

      <HeartButton reflectionId={reflection.id} />

    </div>
  );
}

export default Today;
