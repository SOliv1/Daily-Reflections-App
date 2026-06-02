import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getDailyReflection,
  getReflectionBlockMeta,
  reflectionFocuses
} from "../data/reflections";
import {
  readQuietRoomPreferences,
  writeQuietRoomPreferences
} from "../data/quietRoomPreferences";
import "./Testing.css";

const rhythmChoices = [
  { id: "auto", label: "Let the day guide me" },
  { id: "morning", label: "Show me morning clarity" },
  { id: "evening", label: "Show me evening warmth" },
  { id: "night", label: "Show me night calm" },
  { id: "surprise", label: "Surprise me gently" }
];

const focusChoices = [
  { id: "thoughtful", label: "Thoughtful moments" },
  { id: "cherish", label: "Cherished ideas" },
  { id: "readiness", label: "Quiet readiness" },
  { id: "release", label: "Soft release" },
  { id: "timeless", label: "Timeless calm" }
];

const orbChoices = [
  { id: "auto", label: "Auto" },
  { id: "dawn", label: "Dawn" },
  { id: "neutral", label: "Neutral" },
  { id: "warm", label: "Warm" },
  { id: "night", label: "Night" },
  { id: "midnight", label: "Midnight" }
];

const DAILY_ORB_URL = "https://soliv1.github.io/Daily-Reflections-App/";
const SEASONAL_STUDIO_URL = "https://seasonal.studio/";

function getOrbLabel(preferences, blockMeta) {
  if (preferences.orb === "auto") {
    return blockMeta.orb;
  }

  const selectedOrb = orbChoices.find((orb) => orb.id === preferences.orb);
  return selectedOrb ? `${selectedOrb.label} Orb` : blockMeta.orb;
}

function getShareText({ reflection, focusLabel, orbLabel }) {
  return [
    `"${reflection.line}"`,
    "",
    reflection.title,
    `${focusLabel} - ${orbLabel}`,
    "",
    "Shared from Daily Orb: Reflections.",
    "A Reflections in Light space by Seasonal.Studio.",
    DAILY_ORB_URL,
    SEASONAL_STUDIO_URL
  ].join("\n");
}

function QuietRoom() {
  const [preferences, setPreferences] = useState(() => readQuietRoomPreferences());
  const [shareMessage, setShareMessage] = useState("");
  const today = useMemo(() => new Date(), []);
  const reflection = getDailyReflection(today, preferences);
  const blockMeta = getReflectionBlockMeta(today);
  const selectedFocus = preferences.focus ? reflectionFocuses[preferences.focus] : null;
  const focusLabel = selectedFocus?.label || blockMeta.category;
  const orbLabel = getOrbLabel(preferences, blockMeta);

  const choose = (key, value) => {
    setPreferences((current) => writeQuietRoomPreferences({
      ...current,
      [key]: value
    }));
  };

  const shareReflection = async () => {
    const text = getShareText({ reflection, focusLabel, orbLabel });

    try {
      if (navigator.share) {
        await navigator.share({
          title: reflection.title,
          text
        });
        setShareMessage("Shared gently.");
        return;
      }

      await navigator.clipboard.writeText(text);
      setShareMessage("Copied for sharing.");
    } catch {
      setShareMessage("The reflection is here when you are ready.");
    }
  };

  return (
    <main
      className="quiet-room page-fade"
      style={{ "--quiet-midnight-orb": `url(${process.env.PUBLIC_URL}/images/orbs/orb-midnight-glow.png)` }}
    >
      <section className="quiet-room-hero">
        <div className="quiet-room-hero-light" aria-hidden="true" />
        <div className="quiet-room-hero-copy">
          <p className="quiet-room-kicker">The Quiet Room</p>
          <h1>Your Atmosphere</h1>
          <p>
            A soft interior for shaping the feeling of today before you carry it
            back into the app.
          </p>
        </div>

        <div className="quiet-room-orb-stage">
          <div className={`quiet-room-orb quiet-room-orb-${preferences.orb || "auto"}`} aria-hidden="true" />
          <span>{preferences.orb === "auto" ? "Listening to the day" : "Holding your chosen light"}</span>
        </div>

        <a
          className="quiet-room-brand-orb"
          href={SEASONAL_STUDIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Seasonal.Studio"
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/logos/r-logo-pearl-128.png`}
            alt=""
            aria-hidden="true"
          />
          <span>Seasonal.Studio</span>
        </a>
      </section>

      <section className="quiet-room-layout" aria-label="Your atmosphere choices">
        <div className="quiet-room-wing quiet-room-wing-left">
          <section className="quiet-room-panel quiet-room-panel-tall">
            <p className="quiet-room-kicker">Today's rhythm</p>
            <p className="quiet-room-question">How would you like today to feel?</p>
            <div className="quiet-room-sentences">
              {rhythmChoices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  className={preferences.rhythm === choice.id ? "quiet-choice selected" : "quiet-choice"}
                  onClick={() => choose("rhythm", choice.id)}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="quiet-room-reflection">
          <p className="quiet-room-kicker">Held in the room</p>
          <h2>{reflection.title}</h2>
          <blockquote>{reflection.line}</blockquote>
          <p>
            {focusLabel} · {orbLabel}
          </p>
          <div className="quiet-room-actions">
            <Link to="/today" className="quiet-room-link">
              Carry this into today
            </Link>
            <button type="button" className="quiet-room-link" onClick={shareReflection}>
              Share this reflection
            </button>
          </div>
          {shareMessage && <p className="quiet-room-share-note">{shareMessage}</p>}
        </section>

        <div className="quiet-room-wing quiet-room-wing-right">
          <section className="quiet-room-panel">
            <p className="quiet-room-kicker">Close by</p>
            <p className="quiet-room-question">What kind of reflection would you like close by?</p>
            <div className="quiet-room-pills">
              {focusChoices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  className={preferences.focus === choice.id ? "quiet-pill selected" : "quiet-pill"}
                  onClick={() => choose("focus", choice.id)}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          </section>

          <section className="quiet-room-panel">
            <p className="quiet-room-kicker">Companion light</p>
            <p className="quiet-room-question">Which orb accompanies you today?</p>
            <div className="quiet-room-orb-row">
              {orbChoices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  className={preferences.orb === choice.id ? "quiet-orb-choice selected" : "quiet-orb-choice"}
                  onClick={() => choose("orb", choice.id)}
                >
                  <span className={`quiet-orb-dot quiet-orb-dot-${choice.id}`} aria-hidden="true" />
                  <span>{choice.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default QuietRoom;
