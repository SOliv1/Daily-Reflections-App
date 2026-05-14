import React, { useState, useEffect } from "react";

function HeartButton({ reflectionId }) {
  const [isFavourite, setIsFavourite] = useState(false);

  // Load initial favourite state
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favourites")) || [];
    setIsFavourite(saved.includes(reflectionId));
  }, [reflectionId]);

  // Toggle favourite
  const toggleFavourite = () => {
    const saved = JSON.parse(localStorage.getItem("favourites")) || [];

    let updated;
    if (saved.includes(reflectionId)) {
      updated = saved.filter((id) => id !== reflectionId);
      setIsFavourite(false);
    } else {
      updated = [...saved, reflectionId];
      setIsFavourite(true);
    }

    localStorage.setItem("favourites", JSON.stringify(updated));
  };

  return (
    <button onClick={toggleFavourite} style={styles.button}>
      {isFavourite ? "❤️ Saved" : "🤍 Save to Favourites"}
    </button>
  );
}

const styles = {
  button: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    background: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(6px)",
    color: "#333",
    marginTop: "15px",
  },
};

export default HeartButton;
