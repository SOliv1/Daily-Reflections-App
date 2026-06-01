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

export function getDailyReflection(date = new Date()) {
  return reflections[date.getDay()];
}

export function getDailyOrbLine(date = new Date()) {
  return getDailyReflection(date)?.line || "";
}

export default reflections;
