const reflections = [
  {
    id: 1,
    title: "Still Water",
    line: "What is mine flows to me in perfect measure.",
    mood: "trust",
    image: process.env.PUBLIC_URL + "/images/reflections1.png"
  },
  {
    id: 2,
    title: "First Light",
    line: "Today does not repeat. It unfolds.",
    mood: "presence",
    image: process.env.PUBLIC_URL + "/images/reflections2.jpg"
  },
  {
    id: 3,
    title: "Quiet Room",
    line: "Nothing real is lost.",
    mood: "calm",
    image: process.env.PUBLIC_URL + "/images/reflections3-deepOcean.png"
  },
  {
    id: 4,
    title: "Open Field",
    line: "There is more space than you think.",
    mood: "spacious",
    image: process.env.PUBLIC_URL + "/images/reflections4.jpg"
  },
  {
    id: 5,
    title: "Small Candle",
    line: "A little clarity is enough for the next step.",
    mood: "clarity",
    image: process.env.PUBLIC_URL + "/images/reflections5.jpg"
  },
  {
    id: 6,
    title: "Gentle Tide",
    line: "You are allowed to arrive slowly.",
    mood: "ease",
    image: process.env.PUBLIC_URL + "/images/reflections6.jpg"
  },
  {
    id: 7,
    title: "Safe Harbour",
    line: "You are not late for your own life.",
    mood: "reassurance",
    image: process.env.PUBLIC_URL + "/images/reflections7.jpg"
  },
  {
    id: 8,
    title: "Tidal Blue Orb-gentle wave reflections",
    line: "Nothing real is lost.",
    mood: "reassurance",
    image: process.env.PUBLIC_URL + "/images/Tidal-Blue-Orb.png"
  },
  {
    id: 9,
    title: "Forest Dawn Orb-pale greens, soft gold, morning haze",
    line: "You stand on solid ground.",
    mood: "grounding",
    image: process.env.PUBLIC_URL + "/images/Forest-DawnOrb.png"
  },
  {
    id: 10,
    title: "Soft Breeze Orb, airy gradients, featherlight glow",
    line: "No burden is final.",
    mood: "ease",
    image: process.env.PUBLIC_URL + "/images/soft-Breeze-Orb.png"
  },
  {
    id: 11,
    title: "Light Through the Window",
    line: "Let the light that finds you be enough for today.",
    mood: "spacious",
    image: process.env.PUBLIC_URL + "/images/reflections8.png"
  },
  {
    id: 12,
    title: "Sun Beam Orb, warm golds, radiant light",
    line: "Truth restores balance.",
    mood: "balance",
    image: process.env.PUBLIC_URL + "/images/sunBeamOrb.png"
  },
  {
    id: 13,
    title: "Soft Strength",
    line: "Even in the storm, you are still on your path.",
    mood: "reassurance",
    image: process.env.PUBLIC_URL + "/images/reflections11.jpg"
  },
  {
    id: 14,
    title: "A Calm Beginning",
    line: "A calm beginning is always available.\nEven halfway through the day.\nEven halfway through a thought.",
    mood: "thoughtful",
    image: process.env.PUBLIC_URL + "/images/calm-beginning.png"
  },
  {

    id: 15,
    title: "Releasing the Day",
    line: "Sometimes the most graceful act is letting go, softly, without resistance.",
    mood: "thoughtful",
    image: process.env.PUBLIC_URL + "/images/golden-light.png"
  },
  {
    id: 16,
    title: "Ready and Prepared",
    line: "Readiness isn’t a rush. It’s a quiet knowing that the moment has arrived.",
    mood: "thoughtful",
    image: process.env.PUBLIC_URL + "/images/ready-and-prepared.png"
  },
  {
    id: 17,
    title: "Cherish Thought",
    line: "Ideas are living light. Hold them gently; they’ll find their way home.",
    mood: "thoughtful",
    image: process.env.PUBLIC_URL + "/images/cherish-orb.png"
  },
  {

    id: 18,
    title: "Cherish Ideas",
    line: "Ideas are living light. Hold them gently; they’ll find their way home.",
    mood: "thoughtful",
    image: process.env.PUBLIC_URL + "/images/cherish-ideas.jpg"
  },
  {
  id: 19,
    title: "Timely Ideas",
    line: "Some ideas arrive right on time — quiet, precise, and exactly what you needed.",
    mood: "thoughtful",
    image: process.env.PUBLIC_URL + "/images/timely-ideas.jpg"
  },
  {
  id: 20,
    title: "Timeless Ideas",
    line: "Some ideas don’t belong to any moment at all. They stay, steady and luminous.",
    mood: "thoughtful",
    image: process.env.PUBLIC_URL + "/images/glowingOrb-in-darkness.png"
  }



];

export const reflectionBlocks = {
  morning: {
    label: "Morning",
    orb: "Dawn Orb",
    category: "Timely Ideas / Ready & Prepared",
    reflectionIds: [19, 16, 9, 2, 14]
  },
  afternoon: {
    label: "Afternoon",
    orb: "Neutral Orb",
    category: "Thoughtful / Cherish / Releasing / Ideas",
    reflectionIds: [17, 18, 15, 14, 4, 12]
  },
  evening: {
    label: "Evening",
    orb: "Warm Orb",
    category: "Cherish / Soft Reflections",
    reflectionIds: [17, 18, 15, 6, 11]
  },
  night: {
    label: "Night",
    orb: "Night Orb",
    category: "Timeless Ideas / Deep Calm",
    reflectionIds: [20, 3, 8, 1, 13]
  }
};

export const reflectionFocuses = {
  thoughtful: {
    label: "Thoughtful moments",
    reflectionIds: [14, 17, 18, 19, 20]
  },
  cherish: {
    label: "Cherished ideas",
    reflectionIds: [17, 18, 11]
  },
  readiness: {
    label: "Quiet readiness",
    reflectionIds: [16, 19, 9, 2]
  },
  release: {
    label: "Soft release",
    reflectionIds: [15, 6, 10]
  },
  timeless: {
    label: "Timeless calm",
    reflectionIds: [20, 3, 1, 8]
  }
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const blockByOrb = {
  dawn: "morning",
  neutral: "afternoon",
  warm: "evening",
  night: "night",
  midnight: "night"
};

function getReflectionById(id) {
  return reflections.find((reflection) => reflection.id === id);
}

function getDaySeed(date) {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY
  );
}

export function getReflectionBlock(date = new Date()) {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function getReflectionBlockMeta(date = new Date()) {
  const block = getReflectionBlock(date);

  return {
    key: block,
    ...reflectionBlocks[block]
  };
}

export function getReflectionsForBlock(block) {
  const blockConfig = reflectionBlocks[block];

  if (!blockConfig) {
    return [];
  }

  return blockConfig.reflectionIds
    .map(getReflectionById)
    .filter(Boolean);
}

export function getReflectionsForFocus(focus) {
  const focusConfig = reflectionFocuses[focus];

  if (!focusConfig) {
    return [];
  }

  return focusConfig.reflectionIds
    .map(getReflectionById)
    .filter(Boolean);
}

function getPreferredBlock(date, preferences = {}) {
  if (preferences.rhythm === "morning") return "morning";
  if (preferences.rhythm === "evening") return "evening";
  if (preferences.rhythm === "night") return "night";

  if (preferences.rhythm === "surprise") {
    return null;
  }

  if (preferences.orb && preferences.orb !== "auto") {
    return blockByOrb[preferences.orb] || getReflectionBlock(date);
  }

  return getReflectionBlock(date);
}

function getReflectionCandidates(date, preferences = {}) {
  const preferredBlock = getPreferredBlock(date, preferences);
  const blockReflections = preferredBlock ? getReflectionsForBlock(preferredBlock) : reflections;

  if (!preferences.focus) {
    return blockReflections;
  }

  const focusReflections = getReflectionsForFocus(preferences.focus);
  const focusIds = new Set(focusReflections.map((reflection) => reflection.id));
  const focusedBlockReflections = blockReflections.filter((reflection) => focusIds.has(reflection.id));

  return focusedBlockReflections.length > 0 ? focusedBlockReflections : focusReflections;
}

export function getDailyReflection(date = new Date(), preferences = {}) {
  const blockReflections = getReflectionCandidates(date, preferences);

  if (blockReflections.length === 0) {
    return reflections[0];
  }

  const hour = date.getHours();
  const block = getPreferredBlock(date, preferences) || getReflectionBlock(date);
  const blockStartHour = block === "morning" ? 5 : block === "afternoon" ? 12 : block === "evening" ? 17 : 21;
  const adjustedHour = hour < 5 ? hour + 24 : hour;
  const minutesSinceBlockStart = (adjustedHour - blockStartHour) * 60 + date.getMinutes();
  const slot = Math.floor(minutesSinceBlockStart / 30);

  return blockReflections[(getDaySeed(date) + slot) % blockReflections.length];
}

export function getDailyOrbLine(date = new Date(), preferences = {}) {
  return getDailyReflection(date, preferences)?.line || "";
}

export function getSocialReflections(block = null) {
  return block ? getReflectionsForBlock(block) : reflections;
}

export default reflections;
