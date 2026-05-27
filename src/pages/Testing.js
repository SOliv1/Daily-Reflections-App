import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import reflections, { getDailyReflection } from "../data/reflections";
import "./Testing.css";
import { heroImages } from "../components/heroImagesConfig";
import { useState as useReactState } from "react";

const previewDates = [
  { label: "Sunday", value: "2026-05-17" },
  { label: "Monday", value: "2026-05-18" },
  { label: "Tuesday", value: "2026-05-19" },
  { label: "Wednesday", value: "2026-05-20" },
  { label: "Thursday", value: "2026-05-21" },
  { label: "Friday", value: "2026-05-22" },
  { label: "Saturday", value: "2026-05-23" },
];

function readSavedFavourites() {
  try {
    const saved = JSON.parse(localStorage.getItem("favourites")) || [];
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

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

function Testing() {
  const [favourites, setFavourites] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const [selectedMood, setSelectedMood] = useState("all");
  const [rotationMode, setRotationMode] = useReactState("weekly");
  const [customIndex, setCustomIndex] = useReactState(0);
  const index = getRotationIndex(rotationMode, customIndex);
  const heroImage = `${process.env.PUBLIC_URL}/images/${heroImages[index]}`;
  const heroFilename = heroImages[index];

  useEffect(() => {
    setFavourites(readSavedFavourites());
  }, []);

  const dailyPreview = useMemo(
    () =>
      previewDates.map((item) => ({
        ...item,
        reflection: getDailyReflection(new Date(`${item.value}T12:00:00`)),
      })),
    []
  );

  const dailyReflectionIds = useMemo(
    () => new Set(dailyPreview.map((item) => item.reflection.id)),
    [dailyPreview]
  );

  const moods = useMemo(
    () => Array.from(new Set(reflections.map((reflection) => reflection.mood))).sort(),
    []
  );

  const visibleReflections = useMemo(
    () =>
      selectedMood === "all"
        ? reflections
        : reflections.filter((reflection) => reflection.mood === selectedMood),
    [selectedMood]
  );

  const persistFavourites = (updated) => {
    setFavourites(updated);
    localStorage.setItem("favourites", JSON.stringify(updated));
  };

  const toggleFavourite = (id) => {
    const updated = favourites.includes(id)
      ? favourites.filter((favId) => favId !== id)
      : [...favourites, id];

    persistFavourites(updated);
  };

  const clearFavourites = () => {
    persistFavourites([]);
  };

  const reloadFavourites = () => {
    setFavourites(readSavedFavourites());
  };

  const markImage = (id, status) => {
    setLoadedImages((current) => ({
      ...current,
      [id]: status,
    }));
  };

  return (
    <main className="testing-page page-fade">
      <section className="testing-section testing-intro">
        <h1>Testing</h1>
        <p>
          Check the full reflection library, daily rotation, image rendering, and
          favourites persistence from one place.
        </p>
      </section>

      {/* Hero Image Rotation Preview */}
      {process.env.NODE_ENV === "development" && (
        <section className="testing-section">
          <div className="testing-section-header">
            <h2>Hero Image Rotation</h2>
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
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <img
              src={heroImage}
              alt={heroFilename}
              style={{ maxWidth: 400, width: "100%", borderRadius: 12, boxShadow: "0 2px 12px #0002" }}
            />
          </div>
        </section>
      )}

      <section className="testing-section">
        <div className="testing-section-header">
          <h2>Daily Rotation</h2>
          <Link to="/today" className="testing-link-button">
            Today page
          </Link>
        </div>

        <div className="testing-day-grid">
          {dailyPreview.map((item) => (
            <Link
              key={item.value}
              to={`/today?date=${item.value}`}
              className="testing-day"
            >
              <span>{item.label}</span>
              <strong>{item.reflection.title}</strong>
              <small>{item.value}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="testing-section">
        <div className="testing-section-header">
          <div>
            <h2>Favourites Persistence</h2>
            <p className="testing-muted">
              Saved IDs in localStorage: {JSON.stringify(favourites)}
            </p>
          </div>

          <div className="testing-actions">
            <button type="button" onClick={reloadFavourites}>
              Reload saved
            </button>
            <button type="button" onClick={clearFavourites}>
              Clear
            </button>
            <Link to="/favourites" className="testing-link-button">
              Favourites page
            </Link>
          </div>
        </div>

        <p className="testing-muted">
          Save a few reflections here, open the Favourites page, then refresh the
          browser. The same cards should still be there until you remove or clear
          them.
        </p>
      </section>

      <section className="testing-section">
        <div className="testing-section-header">
          <div>
            <h2>All Reflections</h2>
            <p className="testing-muted">
              Review the image, quote, mood, daily rotation status, and source
              path before publishing content changes.
            </p>
          </div>

          <label className="testing-filter">
            Mood
            <select
              value={selectedMood}
              onChange={(event) => setSelectedMood(event.target.value)}
            >
              <option value="all">All moods</option>
              {moods.map((mood) => (
                <option key={mood} value={mood}>
                  {mood}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="testing-reflection-grid">
          {visibleReflections.map((reflection) => {
            const isFavourite = favourites.includes(reflection.id);
            const imageStatus = loadedImages[reflection.id] || "checking";
            const appearsDaily = dailyReflectionIds.has(reflection.id);

            return (
              <article key={reflection.id} className="testing-card">
                <img
                  src={reflection.image}
                  alt={reflection.title || `Reflection ${reflection.id}`}
                  onLoad={() => markImage(reflection.id, "loaded")}
                  onError={() => markImage(reflection.id, "failed")}
                />

                <div className="testing-card-body">
                  <div className="testing-card-topline">
                    <span>#{reflection.id}</span>
                    <div className="testing-badges">
                      <span
                        className={
                          appearsDaily
                            ? "testing-status testing-status-daily"
                            : "testing-status"
                        }
                      >
                        {appearsDaily ? "Daily rotation" : "Library only"}
                      </span>
                      <span className={`testing-status testing-status-${imageStatus}`}>
                        Image {imageStatus}
                      </span>
                    </div>
                  </div>

                  <h3>{reflection.title || "Untitled reflection"}</h3>
                  <p className="testing-line">{reflection.line}</p>
                  <p className="testing-muted">Mood: {reflection.mood}</p>
                  <code className="testing-path">{reflection.image}</code>

                  <button
                    type="button"
                    className={isFavourite ? "testing-fav saved" : "testing-fav"}
                    onClick={() => toggleFavourite(reflection.id)}
                  >
                    {isFavourite ? "Saved" : "Save"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default Testing;
