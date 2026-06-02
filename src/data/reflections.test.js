import fs from "fs";
import path from "path";
import reflections, {
  getDailyOrbLine,
  getDailyReflection,
  getReflectionBlock,
  getReflectionsForBlock,
  reflectionBlocks
} from "./reflections";

const dayDates = [
  new Date("2026-05-17T12:00:00"),
  new Date("2026-05-18T12:00:00"),
  new Date("2026-05-19T12:00:00"),
  new Date("2026-05-20T12:00:00"),
  new Date("2026-05-21T12:00:00"),
  new Date("2026-05-22T12:00:00"),
  new Date("2026-05-23T12:00:00"),
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

  test("time-of-day blocks use the expected boundaries", () => {
    expect(getReflectionBlock(new Date("2026-05-20T05:00:00"))).toBe("morning");
    expect(getReflectionBlock(new Date("2026-05-20T11:59:00"))).toBe("morning");
    expect(getReflectionBlock(new Date("2026-05-20T12:00:00"))).toBe("afternoon");
    expect(getReflectionBlock(new Date("2026-05-20T16:59:00"))).toBe("afternoon");
    expect(getReflectionBlock(new Date("2026-05-20T17:00:00"))).toBe("evening");
    expect(getReflectionBlock(new Date("2026-05-20T20:59:00"))).toBe("evening");
    expect(getReflectionBlock(new Date("2026-05-20T21:00:00"))).toBe("night");
    expect(getReflectionBlock(new Date("2026-05-20T04:59:00"))).toBe("night");
  });

  test("time blocks point to existing reflections and can grow beyond seven items", () => {
    Object.keys(reflectionBlocks).forEach((block) => {
      const blockReflections = getReflectionsForBlock(block);

      expect(blockReflections.length).toBe(reflectionBlocks[block].reflectionIds.length);
      blockReflections.forEach((reflection) => {
        expect(reflections.some((item) => item.id === reflection.id)).toBe(true);
      });
    });
  });

  test("daily rotation selects from the active time block, not a fixed seven-item list", () => {
    const morningReflection = getDailyReflection(new Date("2026-05-20T05:00:00"));
    const afternoonReflection = getDailyReflection(new Date("2026-05-20T12:00:00"));
    const eveningReflection = getDailyReflection(new Date("2026-05-20T17:00:00"));
    const nightReflection = getDailyReflection(new Date("2026-05-20T21:00:00"));

    expect(reflectionBlocks.morning.reflectionIds).toContain(morningReflection.id);
    expect(reflectionBlocks.afternoon.reflectionIds).toContain(afternoonReflection.id);
    expect(reflectionBlocks.evening.reflectionIds).toContain(eveningReflection.id);
    expect(reflectionBlocks.night.reflectionIds).toContain(nightReflection.id);
  });
});
