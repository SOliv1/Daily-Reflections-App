import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import {
  QUIET_ROOM_STORAGE_KEY,
  defaultQuietRoomPreferences
} from "../data/quietRoomPreferences";
import QuietRoom from "./Testing";

function renderQuietRoom() {
  render(
    <MemoryRouter>
      <QuietRoom />
    </MemoryRouter>
  );
}

describe("Quiet Room", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: jest.fn().mockResolvedValue(undefined)
      }
    });
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined
    });
  });

  test("presents atmospheric choices instead of developer language", () => {
    renderQuietRoom();

    expect(screen.getByRole("heading", { name: /your atmosphere/i })).toBeInTheDocument();
    expect(screen.getByText(/the quiet room/i)).toBeInTheDocument();
    expect(screen.getByText(/how would you like today to feel/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /let the day guide me/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /thoughtful moments/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /dawn/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /midnight/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /seasonal\.studio/i })).toHaveAttribute(
      "href",
      "https://seasonal.studio/"
    );
    expect(screen.queryByText(/testing/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/localstorage/i)).not.toBeInTheDocument();
  });

  test("stores quiet choices behind the room experience", () => {
    renderQuietRoom();

    userEvent.click(screen.getByRole("button", { name: /show me night calm/i }));
    userEvent.click(screen.getByRole("button", { name: /timeless calm/i }));
    userEvent.click(screen.getByRole("button", { name: /^midnight$/i }));

    expect(JSON.parse(localStorage.getItem(QUIET_ROOM_STORAGE_KEY))).toEqual({
      rhythm: "night",
      focus: "timeless",
      orb: "midnight",
      orbSource: "manual",
      surpriseOffset: 0
    });
  });

  test("responds when the rhythm changes", () => {
    renderQuietRoom();

    userEvent.click(screen.getByRole("button", { name: /show me morning clarity/i }));

    expect(screen.getAllByText(/morning clarity enters the room/i).length).toBeGreaterThan(0);
    expect(JSON.parse(localStorage.getItem(QUIET_ROOM_STORAGE_KEY))).toEqual(
      expect.objectContaining({
        rhythm: "morning",
        orb: "dawn",
        orbSource: "rhythm"
      })
    );
  });

  test("surprise me gently refreshes the held reflection", () => {
    renderQuietRoom();

    userEvent.click(screen.getByRole("button", { name: /surprise me gently/i }));
    userEvent.click(screen.getByRole("button", { name: /surprise me gently/i }));

    expect(JSON.parse(localStorage.getItem(QUIET_ROOM_STORAGE_KEY))).toEqual(
      expect.objectContaining({
        rhythm: "surprise",
        orb: "auto",
        orbSource: "rhythm",
        surpriseOffset: 2
      })
    );
    expect(screen.getAllByText(/a gentle surprise has arrived/i).length).toBeGreaterThan(0);
  });

  test("offers the selected reflection as a continuation into Today", () => {
    renderQuietRoom();

    expect(screen.getByRole("link", { name: /carry this into today/i })).toHaveAttribute(
      "href",
      "/today"
    );
  });

  test("copies a social-ready reflection when sharing", async () => {
    renderQuietRoom();

    userEvent.click(screen.getByRole("button", { name: /share this reflection/i }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining("Shared from Daily Orb: Reflections.")
      );
    });
    const sharedText = navigator.clipboard.writeText.mock.calls[0][0];

    expect(sharedText).toEqual(expect.stringContaining("A Reflections in Light space by Seasonal.Studio."));
    expect(sharedText).toEqual(expect.stringContaining("https://soliv1.github.io/Daily-Reflections-App/"));
    expect(sharedText).toEqual(expect.stringContaining("https://seasonal.studio/"));
    await waitFor(() => {
      expect(screen.getByText(/copied for sharing/i)).toBeInTheDocument();
    });
  });

  test("reset room restores default choices", () => {
    renderQuietRoom();

    userEvent.click(screen.getByRole("button", { name: /show me night calm/i }));
    userEvent.click(screen.getByRole("button", { name: /timeless calm/i }));
    userEvent.click(screen.getByRole("button", { name: /^midnight$/i }));
    userEvent.click(screen.getByRole("button", { name: /reset room/i }));

    expect(JSON.parse(localStorage.getItem(QUIET_ROOM_STORAGE_KEY))).toEqual(defaultQuietRoomPreferences);
    expect(screen.getAllByText(/the room is listening to the hour you are in/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("status")).toHaveTextContent(/room reset to default/i);
  });
});
