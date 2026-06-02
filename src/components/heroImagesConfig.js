// List of hero image filenames (relative to public/images)
export const heroImages = [
  "hero1.jpg",
  "hero2.jpg",
  "hero3.jpg",
  "hero4.jpg"
  // Add/remove filenames as needed
];

// Atmosphere-aware pools so hero art can match the current reflection block.
export const heroImagesByBlock = {
  morning: ["hero1.jpg", "Forest-DawnOrb.png", "reflections2.jpg"],
  afternoon: ["hero2.jpg", "reflections4.jpg", "reflections5.jpg"],
  evening: ["hero3.jpg", "golden-light.png", "sunBeamOrb.png", "reflections6.jpg"],
  night: ["hero4.jpg", "reflections3-deepOcean.png", "glowingOrb-in-darkness.png", "Tidal-Blue-Orb.png"]
};

// Rotation modes: 'weekly', 'daily', 'monthly', 'custom'
export const heroRotationMode = "weekly"; // Change to 'daily', 'monthly', or 'custom' as needed
