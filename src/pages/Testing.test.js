import { render, screen, waitFor, within } from "@testing-library/react";
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
  let openSpy;

  beforeEach(() => {
    localStorage.clear();
    openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
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

  afterEach(() => {
    openSpy.mockRestore();
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

  test("shows the selected focus in the room status", () => {
    renderQuietRoom();

    userEvent.click(screen.getByRole("button", { name: /timeless calm/i }));

    const statusSection = screen.getByRole("region", { name: /what changed/i });
    expect(within(statusSection).getByText("Focus")).toBeInTheDocument();
    expect(within(statusSection).getByText("Timeless calm")).toBeInTheDocument();
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

  test("offers a quiet path into Centre Notes", () => {
    renderQuietRoom();

    const centreNotesLink = screen.getByRole("link", { name: /write a small thought in centre notes/i });

    expect(centreNotesLink).toHaveTextContent(/write a small thought/i);
    expect(centreNotesLink).toHaveAttribute("href", "https://centre-notes.netlify.app/");
    expect(centreNotesLink).toHaveAttribute("target", "_blank");
    expect(centreNotesLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("offers direct social share options", () => {
    renderQuietRoom();

    expect(screen.getByRole("button", { name: /share everywhere/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /instagram/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy caption \+ hashtags/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open image/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /download image/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /preview sample post/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /facebook/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /pinterest/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /tumblr/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
  });

  test("shows sample post preview when requested", () => {
    renderQuietRoom();

    expect(screen.queryByText(/^sample post$/i)).not.toBeInTheDocument();
    userEvent.click(screen.getByRole("button", { name: /preview sample post/i }));

    expect(screen.getByText(/^sample post$/i)).toBeInTheDocument();
    expect(screen.getByText(/shared from daily orb: reflections\./i)).toBeInTheDocument();
    expect(screen.getByText(/#dailyorb/i)).toBeInTheDocument();
  });

  test("copies caption and hashtags for social posting", async () => {
    renderQuietRoom();

    userEvent.click(screen.getByRole("button", { name: /copy caption \+ hashtags/i }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("#DailyOrb"));
    });
    await waitFor(() => {
      expect(screen.getByText(/caption and hashtags copied/i)).toBeInTheDocument();
    });
  });

  test("opens reflection image in a new tab for media posting", () => {
    renderQuietRoom();

    userEvent.click(screen.getByRole("button", { name: /open image/i }));

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining("/images/"),
      "_blank",
      "noopener,noreferrer"
    );
  });

  test("share everywhere opens social pages and copies caption once", async () => {
    renderQuietRoom();

    userEvent.click(screen.getByRole("button", { name: /share everywhere/i }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    });
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining("facebook.com/sharer"),
      "_blank",
      "noopener,noreferrer"
    );
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining("pinterest.com/pin/create/button"),
      "_blank",
      "noopener,noreferrer"
    );
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining("tumblr.com/widgets/share/tool"),
      "_blank",
      "noopener,noreferrer"
    );
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining("linkedin.com/sharing/share-offsite"),
      "_blank",
      "noopener,noreferrer"
    );
    expect(openSpy).toHaveBeenCalledWith(
      "https://www.instagram.com/",
      "_blank",
      "noopener,noreferrer"
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
