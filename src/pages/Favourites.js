import React, { useEffect, useState } from "react";
import reflections from "../data/reflections";

function Favourites() {
  const [favourites, setFavourites] = useState([]);

  // Load favourites from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favourites")) || [];
    setFavourites(saved);
  }, []);

  // Remove a favourite
  const removeFavourite = (id) => {
    const updated = favourites.filter((favId) => favId !== id);
    setFavourites(updated);
    localStorage.setItem("favourites", JSON.stringify(updated));
  };

  // Build a list of full reflection objects
  const favouriteReflections = reflections.filter((r) =>
    favourites.includes(r.id)
  );

  return (
    <div style={styles.container} className="page-fade">
      <h1 style={styles.heading}>Your Favourites</h1>

      {favouriteReflections.length === 0 && (
        <p style={styles.empty}>
          Your favourites will appear here when a reflection feels like home.
        </p>
      )}

      <div style={styles.list}>
        {favouriteReflections.map((item) => (
          <div key={item.id} style={styles.card}>
            <img src={item.image} alt={item.title} style={styles.image} />

            <h2 style={styles.title}>{item.title}</h2>
            <p style={styles.line}>{item.line}</p>
            <p style={styles.mood}>Mood: {item.mood}</p>

            <button
              style={styles.removeButton}
              onClick={() => removeFavourite(item.id)}
            >
              Remove ❤️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "700px",
    margin: "0 auto",
    textAlign: "center",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  empty: {
    opacity: 0.7,
    fontStyle: "italic",
  },
  list: {
    display: "grid",
    gap: "20px",
  },
  card: {
    padding: "15px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(6px)",
  },
  image: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  title: {
    fontSize: "1.4rem",
    marginBottom: "5px",
  },
  line: {
    fontSize: "1.1rem",
    fontStyle: "italic",
    marginBottom: "5px",
  },
  mood: {
    opacity: 0.7,
    marginBottom: "10px",
  },
  removeButton: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    background: "#ff6b6b",
    color: "white",
    cursor: "pointer",
  },
};

export default Favourites;
