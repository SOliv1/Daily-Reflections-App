import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Today from "./Today";

function renderTodayAt(path) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Today />
    </MemoryRouter>
  );
}

describe("Today page date preview", () => {
  test("renders the reflection for the date passed in the URL", () => {
    renderTodayAt("/today?date=2026-05-20");

    expect(screen.getByRole("heading", { name: /open field/i })).toBeInTheDocument();
    expect(screen.getByText(/there is more space than you think/i)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /open field/i })).toHaveAttribute(
      "src",
      expect.stringContaining("/images/reflections4.jpg")
    );
  });
});
