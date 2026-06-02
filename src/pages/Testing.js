import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getDailyReflection,
  getReflectionBlockMeta,
  reflectionBlocks,
  reflectionFocuses
} from "../data/reflections";
import {
  defaultQuietRoomPreferences,
  readQuietRoomPreferences,
  writeQuietRoomPreferences
} from "../data/quietRoomPreferences";
import "./Testing.css";

const rhythmChoices = [
  {
    id: "auto",
    label: "Let the day guide me",
    response: "The room is listening to the hour you are in."
  },
  {
    id: "morning",
    label: "Show me morning clarity",
    block: "morning",
    orb: "dawn",
    response: "Morning clarity enters the room."
  },
  {
    id: "evening",
    label: "Show me evening warmth",
    block: "evening",
    orb: "warm",
    response: "Evening warmth settles around you."
  },
  {
    id: "night",
    label: "Show me night calm",
    block: "night",
    orb: "night",
    response: "Night calm gathers softly."
  },
  {
    id: "surprise",
    label: "Surprise me gently",
    orb: "auto",
    response: "A gentle surprise has arrived."
  }
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

function getRhythmChoice(rhythm) {
  return rhythmChoices.find((choice) => choice.id === rhythm) || rhythmChoices[0];
}

function getQuietRoomBlockMeta(date, preferences) {
  const rhythmChoice = getRhythmChoice(preferences.rhythm);

  if (rhythmChoice.block) {
    return {
      key: rhythmChoice.block,
      ...reflectionBlocks[rhythmChoice.block]
    };
  }

  return getReflectionBlockMeta(date);
}

function getOrbClass(preferences) {
  return getEffectiveOrbId(preferences);
}

function getEffectiveOrbId(preferences) {
  const rhythmOrb = getRhythmChoice(preferences.rhythm).orb;

  if (preferences.orbSource !== "manual" && rhythmOrb) {
    return rhythmOrb;
  }

  if (preferences.orb && preferences.orb !== "auto") {
    return preferences.orb;
  }

  return "auto";
}

function getOrbLabel(preferences, blockMeta) {
  const effectiveOrbId = getEffectiveOrbId(preferences);

  if (effectiveOrbId === "auto") {
    return blockMeta.orb;
  }

  const selectedOrb = orbChoices.find((orb) => orb.id === effectiveOrbId);
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

function getImpactMessage(key, value) {
  if (key === "rhythm") {
    const rhythm = getRhythmChoice(value);
    return `Rhythm updated: ${rhythm.label}. The reflection stream now follows this tone.`;
  }

  if (key === "focus") {
    const focus = reflectionFocuses[value];
    return focus
      ? `Focus updated: ${focus.label}. Upcoming reflections will lean into this theme.`
      : "Focus cleared. Reflections will follow your rhythm and orb.";
  }

  if (key === "orb") {
    const orb = orbChoices.find((choice) => choice.id === value);
    return orb?.id === "auto"
      ? "Orb updated: Auto. Light will be chosen with the day."
      : `Orb updated: ${orb?.label || "Auto"}. Visual atmosphere now follows this orb.`;
  }

  return "The room is listening.";
}

function QuietRoom() {
  const [preferences, setPreferences] = useState(() => readQuietRoomPreferences());
  const [shareMessage, setShareMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [roomResponse, setRoomResponse] = useState(() => getRhythmChoice(preferences.rhythm).response);
  const [lastChangedKey, setLastChangedKey] = useState("rhythm");
  const [impactMessage, setImpactMessage] = useState(() => getImpactMessage("rhythm", preferences.rhythm));
  const today = useMemo(() => new Date(), []);
  const reflection = getDailyReflection(today, preferences);
  const blockMeta = getQuietRoomBlockMeta(today, preferences);
  const selectedFocus = preferences.focus ? reflectionFocuses[preferences.focus] : null;
  const focusApplies = selectedFocus?.reflectionIds.includes(reflection.id);
  const focusLabel = focusApplies ? selectedFocus.label : blockMeta.category;
  const orbLabel = getOrbLabel(preferences, blockMeta);
  const orbClass = getOrbClass(preferences);
  const selectedOrbId = getEffectiveOrbId(preferences);
  const selectedRhythm = getRhythmChoice(preferences.rhythm);
  const selectedFocusChoice = focusChoices.find((choice) => choice.id === preferences.focus);
  const selectedOrbChoice = orbChoices.find((choice) => choice.id === selectedOrbId);

  const statusNote = focusApplies
    ? "This reflection matches your selected focus and rhythm."
    : "This reflection follows your rhythm and orb, while your focus is guiding what comes next.";

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage("");
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const choose = (key, value) => {
    const rhythmChoice = key === "rhythm" ? getRhythmChoice(value) : null;

    setPreferences((current) => writeQuietRoomPreferences({
      ...current,
      [key]: value,
      ...(rhythmChoice?.orb ? { orb: rhythmChoice.orb, orbSource: "rhythm" } : {}),
      ...(key === "orb" ? { orbSource: "manual" } : {}),
      ...(key === "rhythm" && value === "surprise"
        ? { surpriseOffset: (Number(current.surpriseOffset) || 0) + 1 }
        : {})
    }));

    if (key === "rhythm") {
      setRoomResponse(getRhythmChoice(value).response);
      setShareMessage("");
    }

    if (key === "focus") {
      const focus = reflectionFocuses[value];
      setRoomResponse(focus ? `${focus.label} are close by now.` : "The room is listening.");
      setShareMessage("");
    }

    if (key === "orb") {
      const selectedOrb = orbChoices.find((orb) => orb.id === value);
      setRoomResponse(selectedOrb?.id === "auto"
        ? "The room will choose the light with the day."
        : `${selectedOrb?.label} light is with you now.`);
      setShareMessage("");
    }

    setLastChangedKey(key);
    setImpactMessage(getImpactMessage(key, value));
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

  const resetRoom = () => {
    const nextPreferences = writeQuietRoomPreferences(defaultQuietRoomPreferences);

    setPreferences(nextPreferences);
    setLastChangedKey("rhythm");
    setRoomResponse(getRhythmChoice(nextPreferences.rhythm).response);
    setImpactMessage("Room reset to default. Rhythm, focus, and orb are now set to automatic.");
    setShareMessage("");
    setToastMessage("Room reset to default.");
  };

  return (
    <main
      className={`quiet-room quiet-room-rhythm-${preferences.rhythm || "auto"} page-fade`}
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
          <div className={`quiet-room-orb quiet-room-orb-${orbClass}`} aria-hidden="true" />
          <span>{roomResponse}</span>
        </div>

        <a
          className="quiet-room-brand-orb"
          href={SEASONAL_STUDIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Seasonal.Studio"
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/logos/seasonal-studio-golden-orb-logo.png`}
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
            <p className="quiet-room-response" aria-live="polite">{roomResponse}</p>
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

        <section
          key={`${reflection.id}-${preferences.rhythm}-${preferences.focus}-${selectedOrbId}-${preferences.surpriseOffset}`}
          className="quiet-room-reflection"
        >
          <p className="quiet-room-kicker">Held in the room</p>
          <h2>{reflection.title}</h2>
          <blockquote>{reflection.line}</blockquote>
          <p>
            {focusLabel} · {orbLabel}
          </p>
          <section className="quiet-room-status" aria-live="polite" aria-label="What changed">
            <p className="quiet-room-status-title">What changed</p>
            <ul className="quiet-room-status-list">
              <li className={lastChangedKey === "rhythm" ? "quiet-room-status-item changed" : "quiet-room-status-item"}>
                <span>Rhythm</span>
                <strong>{selectedRhythm.label}</strong>
              </li>
              <li className={lastChangedKey === "focus" ? "quiet-room-status-item changed" : "quiet-room-status-item"}>
                <span>Focus</span>
                <strong>{selectedFocusChoice?.label || "No focus selected"}</strong>
              </li>
              <li className={lastChangedKey === "orb" ? "quiet-room-status-item changed" : "quiet-room-status-item"}>
                <span>Orb</span>
                <strong>{selectedOrbChoice?.label || "Auto"}</strong>
              </li>
            </ul>
            <p className="quiet-room-status-note">{statusNote}</p>
            <p className="quiet-room-status-impact" aria-live="polite">{impactMessage}</p>
          </section>
          <div className="quiet-room-actions">
            <Link to="/today" className="quiet-room-link">
              Carry this into today
            </Link>
            <button type="button" className="quiet-room-link" onClick={shareReflection}>
              Share this reflection
            </button>
            <button type="button" className="quiet-room-link quiet-room-link-reset" onClick={resetRoom}>
              Reset room
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
                  className={selectedOrbId === choice.id ? "quiet-orb-choice selected" : "quiet-orb-choice"}
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

      {toastMessage && (
        <div className="quiet-room-toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}
    </main>
  );
}

export default QuietRoom;
