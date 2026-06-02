export const QUIET_ROOM_STORAGE_KEY = "quietRoomPreferences";

export const defaultQuietRoomPreferences = {
  rhythm: "auto",
  focus: null,
  orb: "auto"
};

export function readQuietRoomPreferences() {
  if (typeof window === "undefined") {
    return defaultQuietRoomPreferences;
  }

  try {
    const saved = JSON.parse(window.localStorage.getItem(QUIET_ROOM_STORAGE_KEY));

    return {
      ...defaultQuietRoomPreferences,
      ...(saved && typeof saved === "object" ? saved : {})
    };
  } catch {
    return defaultQuietRoomPreferences;
  }
}

export function writeQuietRoomPreferences(preferences) {
  const nextPreferences = {
    ...defaultQuietRoomPreferences,
    ...preferences
  };

  window.localStorage.setItem(QUIET_ROOM_STORAGE_KEY, JSON.stringify(nextPreferences));

  return nextPreferences;
}
