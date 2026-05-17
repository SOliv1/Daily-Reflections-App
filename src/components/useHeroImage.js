import { heroImages, heroRotationMode } from "./heroImagesConfig";

function getRotationIndex(mode) {
  const now = new Date();
  switch (mode) {
    case "daily":
      // Day of year
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now - start;
      const day = Math.floor(diff / (1000 * 60 * 60 * 24));
      return day % heroImages.length;
    case "monthly":
      return now.getMonth() % heroImages.length;
    case "weekly":
    default:
      // Week of year
      const startYear = new Date(now.getFullYear(), 0, 1);
      const week = Math.floor((now - startYear) / (7 * 24 * 60 * 60 * 1000));
      return week % heroImages.length;
  }
}

export function useHeroImage() {
  const index = getRotationIndex(heroRotationMode);
  const heroImage = `${process.env.PUBLIC_URL}/images/${heroImages[index]}`;
  return { heroImage, heroIndex: index + 1, heroFilename: heroImages[index] };
}
