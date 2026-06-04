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
  { id: "timeless", label: "Timeless calm" },
  { id: "stable", label: "Stable ground" },
  { id: "steady", label: "Steady focus" },
  { id: "useful", label: "Quiet usefulness" },
  { id: "serene", label: "Serene ease" },
  { id: "tranquil", label: "Tranquil calm" }
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
const CENTRE_NOTES_URL = "https://centre-notes.netlify.app/";
const SEASONAL_MIND_SPACE_URL = "https://soliv1.github.io/Seasonal-mind-space/";
const SEASONAL_STUDIO_URL = "https://seasonal.studio/";

function withDailyReturn(url) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}from=daily-reflections&returnTo=${encodeURIComponent(DAILY_ORB_URL)}`;
}

function getRhythmChoice(rhythm) {
  return rhythmChoices.find((choice) => choice.id === rhythm) || rhythmChoices[0];
}

function normalizeFocusId(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function getSelectedFocusChoice(focusValue) {
  const normalizedFocusId = normalizeFocusId(focusValue);

  if (!normalizedFocusId) {
    return null;
  }

  return focusChoices.find((choice) => {
    const normalizedId = normalizeFocusId(choice.id);
    const normalizedLabel = normalizeFocusId(choice.label);
    return normalizedFocusId === normalizedId || normalizedFocusId === normalizedLabel;
  }) || null;
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

function toHashtagSegment(value) {
  return String(value || "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

function getShareHashtags({ reflection, focusLabel, orbLabel }) {
  const candidates = [
    "DailyOrb",
    "ReflectionsInLight",
    "SeasonalStudio",
    toHashtagSegment(reflection.title),
    toHashtagSegment(focusLabel),
    toHashtagSegment(orbLabel)
  ].filter(Boolean);

  return [...new Set(candidates)].map((tag) => `#${tag}`).join(" ");
}

function getAbsoluteReflectionImageUrl(imagePath) {
  if (typeof imagePath !== "string" || !imagePath.trim()) {
    return "";
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const baseUrl = DAILY_ORB_URL.replace(/\/$/, "");
  const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  return `${baseUrl}${normalizedPath}`;
}

function getRuntimeReflectionImageUrl(imagePath) {
  if (typeof imagePath !== "string" || !imagePath.trim()) {
    return "";
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  if (typeof window === "undefined") {
    return imagePath;
  }

  if (imagePath.startsWith("/")) {
    return `${window.location.origin}${imagePath}`;
  }

  return `${window.location.origin}/${imagePath.replace(/^\/+/, "")}`;
}

function getSocialShareLinks({ reflection, focusLabel, orbLabel }) {
  const shareUrl = encodeURIComponent(DAILY_ORB_URL);
  const title = encodeURIComponent(`${reflection.title} · ${focusLabel}`);
  const summary = encodeURIComponent(`"${reflection.line}" · ${focusLabel} · ${orbLabel}`);
  const media = encodeURIComponent(getAbsoluteReflectionImageUrl(reflection.image));

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${summary}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${summary}&media=${media}`,
    tumblr: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${shareUrl}&title=${title}&caption=${summary}`
  };
}

function openShareWindow(url) {
  if (!url) {
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

function getImageFileName(imageUrl) {
  if (!imageUrl) {
    return "reflection-image";
  }

  const withoutQuery = imageUrl.split("?")[0];
  const parts = withoutQuery.split("/");
  return parts[parts.length - 1] || "reflection-image";
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
  const [showSamplePost, setShowSamplePost] = useState(false);
  const [isReflectionImageAvailable, setIsReflectionImageAvailable] = useState(true);
  const [roomResponse, setRoomResponse] = useState(() => getRhythmChoice(preferences.rhythm).response);
  const [lastChangedKey, setLastChangedKey] = useState("rhythm");
  const [impactMessage, setImpactMessage] = useState(() => getImpactMessage("rhythm", preferences.rhythm));
  const today = useMemo(() => new Date(), []);
  const reflection = getDailyReflection(today, preferences);
  const blockMeta = getQuietRoomBlockMeta(today, preferences);
  const selectedFocusId = normalizeFocusId(preferences.focus);
  const selectedFocus = selectedFocusId ? reflectionFocuses[selectedFocusId] : null;
  const focusApplies = selectedFocus?.reflectionIds.includes(reflection.id);
  const focusLabel = focusApplies ? selectedFocus.label : blockMeta.category;
  const orbLabel = getOrbLabel(preferences, blockMeta);
  const orbClass = getOrbClass(preferences);
  const selectedOrbId = getEffectiveOrbId(preferences);
  const selectedRhythm = getRhythmChoice(preferences.rhythm);
  const selectedFocusChoice = getSelectedFocusChoice(preferences.focus);
  const selectedOrbChoice = orbChoices.find((choice) => choice.id === selectedOrbId);
  const socialShareLinks = getSocialShareLinks({ reflection, focusLabel, orbLabel });
  const mediaImageUrl = getRuntimeReflectionImageUrl(reflection.image);
  const hashtagLine = getShareHashtags({ reflection, focusLabel, orbLabel });
  const samplePostText = `${getShareText({ reflection, focusLabel, orbLabel })}\n\n${hashtagLine}`;

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

  useEffect(() => {
    if (!mediaImageUrl || typeof Image === "undefined") {
      setIsReflectionImageAvailable(Boolean(mediaImageUrl));
      return undefined;
    }

    let isCancelled = false;
    const image = new Image();

    image.onload = () => {
      if (!isCancelled) {
        setIsReflectionImageAvailable(true);
      }
    };

    image.onerror = () => {
      if (!isCancelled) {
        setIsReflectionImageAvailable(false);
      }
    };

    image.src = mediaImageUrl;

    return () => {
      isCancelled = true;
    };
  }, [mediaImageUrl]);

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

  const shareToInstagram = async () => {
    const text = samplePostText;

    try {
      await navigator.clipboard.writeText(text);
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
      setShareMessage("Caption copied. Paste into Instagram.");
    } catch {
      setShareMessage("Instagram opened. Paste your reflection caption manually.");
    }
  };

  const shareEverywhere = async () => {
    const text = samplePostText;

    openShareWindow(socialShareLinks.facebook);
    openShareWindow(socialShareLinks.pinterest);
    openShareWindow(socialShareLinks.tumblr);
    openShareWindow(socialShareLinks.linkedin);
    openShareWindow("https://www.instagram.com/");

    try {
      await navigator.clipboard.writeText(text);
      setShareMessage("Share pages opened. Caption copied once for Instagram paste.");
    } catch {
      setShareMessage("Share pages opened. If needed, use Share this reflection to copy caption.");
    }
  };

  const copyCaptionWithHashtags = async () => {
    const text = samplePostText;

    try {
      await navigator.clipboard.writeText(text);
      setShareMessage("Caption and hashtags copied.");
    } catch {
      setShareMessage("Could not copy caption automatically.");
    }
  };

  const openImageForPosting = () => {
    if (!mediaImageUrl) {
      setShareMessage("No image is available for this reflection.");
      return;
    }

    if (!isReflectionImageAvailable) {
      setShareMessage("This image cannot be loaded right now. Try another reflection or share text only.");
      return;
    }

    openShareWindow(mediaImageUrl);
    setShareMessage("Image opened in a new tab for posting.");
  };

  const downloadImageForPosting = () => {
    if (!mediaImageUrl) {
      setShareMessage("No image is available for download.");
      return;
    }

    if (!isReflectionImageAvailable) {
      setShareMessage("This image cannot be downloaded right now. Try another reflection or share text only.");
      return;
    }

    const link = document.createElement("a");
    link.href = mediaImageUrl;
    link.download = getImageFileName(mediaImageUrl);
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShareMessage("Image download started.");
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
          <div className="quiet-room-companion-links" aria-label="Companion spaces">
            <a
              className="quiet-room-companion-link"
              href={withDailyReturn(CENTRE_NOTES_URL)}
            >
              Open Centre Notes
            </a>
            <a
              className="quiet-room-companion-link quiet-room-companion-link-secondary"
              href={withDailyReturn(SEASONAL_MIND_SPACE_URL)}
            >
              Explore Seasonal Mind Space
            </a>
          </div>
        </div>

        <div className="quiet-room-orb-stage">
          <div className={`quiet-room-orb quiet-room-orb-${orbClass}`} aria-hidden="true" />
          <span>{roomResponse}</span>
        </div>

        <a
          className="quiet-room-brand-orb"
          href={`${SEASONAL_STUDIO_URL}studio/about`}
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
            <p className="quiet-room-kicker">Rhythm</p>
            <p className="quiet-room-question">How would you like today to feel?</p>
            <p className="quiet-room-selected-meta" aria-live="polite">
              Rhythm selected: <strong>{selectedRhythm.label}</strong>
              {lastChangedKey === "rhythm" ? " · just adjusted" : ""}
            </p>
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
            <a
              className="quiet-room-link quiet-room-link-centre-notes"
              href={withDailyReturn(CENTRE_NOTES_URL)}
              aria-label="Write a small thought in Centre Notes"
            >
              Write a small thought
            </a>
            <button type="button" className="quiet-room-link" onClick={shareReflection}>
              Share this reflection
            </button>
            <button type="button" className="quiet-room-link quiet-room-link-reset" onClick={resetRoom}>
              Reset room
            </button>
          </div>
          <section className="quiet-room-social" aria-label="Share to social media">
            <p className="quiet-room-social-title">Share to social</p>
            <p className="quiet-room-social-hint">
              Quick flow: copy caption, open or download image, then post to your chosen channel.
            </p>
            <div className="quiet-room-social-links">
              <button type="button" className="quiet-room-social-pill quiet-room-social-pill-primary" onClick={shareEverywhere}>
                Share Everywhere
              </button>
              <button type="button" className="quiet-room-social-pill" onClick={shareToInstagram}>
                Instagram
              </button>
              <a className="quiet-room-social-pill" href={socialShareLinks.facebook} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
              <a className="quiet-room-social-pill" href={socialShareLinks.pinterest} target="_blank" rel="noopener noreferrer">
                Pinterest
              </a>
              <a className="quiet-room-social-pill" href={socialShareLinks.tumblr} target="_blank" rel="noopener noreferrer">
                Tumblr
              </a>
              <a className="quiet-room-social-pill" href={socialShareLinks.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
            <p className="quiet-room-social-title quiet-room-social-title-secondary">Media helpers</p>
            {!isReflectionImageAvailable && (
              <p className="quiet-room-social-warning" role="status">
                Image currently unavailable. You can still share caption and hashtags.
              </p>
            )}
            <div className="quiet-room-social-links">
              <button type="button" className="quiet-room-social-pill" onClick={copyCaptionWithHashtags}>
                Copy Caption + Hashtags
              </button>
              <button type="button" className="quiet-room-social-pill" onClick={openImageForPosting}>
                Open Image
              </button>
              <button type="button" className="quiet-room-social-pill" onClick={downloadImageForPosting}>
                Download Image
              </button>
              <button
                type="button"
                className={showSamplePost ? "quiet-room-social-pill quiet-room-social-pill-primary" : "quiet-room-social-pill"}
                onClick={() => setShowSamplePost((current) => !current)}
                aria-expanded={showSamplePost}
                aria-controls="sample-post-preview"
              >
                Preview Sample Post
              </button>
            </div>
            {showSamplePost && (
              <div id="sample-post-preview" className="quiet-room-sample-post" aria-live="polite">
                <p className="quiet-room-sample-post-title">Sample post</p>
                <pre>{samplePostText}</pre>
              </div>
            )}
          </section>
          {shareMessage && <p className="quiet-room-share-note">{shareMessage}</p>}
        </section>

        <div className="quiet-room-wing quiet-room-wing-right">
          <section className="quiet-room-panel">
            <p className="quiet-room-kicker">Focus</p>
            <p className="quiet-room-question">What kind of reflection would you like close by?</p>
            <p className="quiet-room-selected-meta" aria-live="polite">
              Focus selected: <strong>{selectedFocusChoice?.label || "No focus selected"}</strong>
              {lastChangedKey === "focus" ? " · just adjusted" : ""}
            </p>
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
            <p className="quiet-room-kicker">Orb</p>
            <p className="quiet-room-question">Which orb accompanies you today?</p>
            <p className="quiet-room-selected-meta" aria-live="polite">
              Orb selected: <strong>{selectedOrbChoice?.label || "Auto"}</strong>
              {lastChangedKey === "orb" ? " · just adjusted" : ""}
            </p>
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
