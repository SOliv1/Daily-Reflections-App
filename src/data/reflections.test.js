import fs from "fs";
import path from "path";
import reflections, { getDailyOrbLine, getDailyReflection } from "./reflections";

const dayDates = [
  new Date("2026-05-17T12:00:00Z"),
  new Date("2026-05-18T12:00:00Z"),
  new Date("2026-05-19T12:00:00Z"),
  new Date("2026-05-20T12:00:00Z"),
  new Date("2026-05-21T12:00:00Z"),
  new Date("2026-05-22T12:00:00Z"),
  new Date("2026-05-23T12:00:00Z"),
];

function publicImagePath(image) {
  const publicUrl = process.env.PUBLIC_URL || "";
  const relativePath = image.replace(publicUrl, "").replace(/^\/+/, "");

  return path.join(process.cwd(), "public", relativePath);
}

describe("daily reflections data", () => {
  test("returns a complete reflection for every day of the week", () => {
    const dailyReflections = dayDates.map((date) => getDailyReflection(date));

    dailyReflections.forEach((reflection) => {
      expect(reflection).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          line: expect.any(String),
          mood: expect.any(String),
          image: expect.any(String),
        })
      );
      expect(reflection.title.trim()).not.toBe("");
      expect(reflection.line.trim()).not.toBe("");
      expect(reflection.mood.trim()).not.toBe("");
      expect(fs.existsSync(publicImagePath(reflection.image))).toBe(true);
    });
  });

  test("daily orb line matches the selected daily reflection", () => {
    dayDates.forEach((date) => {
      expect(getDailyOrbLine(date)).toBe(getDailyReflection(date).line);
    });
  });

  test("daily rotation uses the expected seven reflections", () => {
    const dailyReflectionIds = dayDates.map((date) => getDailyReflection(date).id);

    expect(dailyReflectionIds).toEqual(reflections.slice(0, 7).map((item) => item.id));
  });
});
