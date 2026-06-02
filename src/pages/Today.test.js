import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getDailyReflection } from "../data/reflections";
import Today from "./Today";

function renderTodayAt(path) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Today />
    </MemoryRouter>
  );
}

describe("Today page date preview", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders the reflection for the date passed in the URL", () => {
    const selectedDate = new Date("2026-05-20T12:00:00");
    const reflection = getDailyReflection(selectedDate);

    renderTodayAt("/today?date=2026-05-20");

    expect(screen.getByRole("heading", { name: reflection.title })).toBeInTheDocument();
    expect(screen.getByText(reflection.line)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: reflection.title })).toHaveAttribute(
      "src",
      reflection.image
    );
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /quiet room/i })).toHaveAttribute("href", "/quiet-room");
  });
});
