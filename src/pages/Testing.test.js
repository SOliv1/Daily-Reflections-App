import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Testing from "./Testing";

function renderTestingPage() {
  render(
    <MemoryRouter>
      <Testing />
    </MemoryRouter>
  );
}

describe("Testing page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("shows daily preview links and the full reflection library", () => {
    renderTestingPage();

    expect(screen.getByRole("heading", { name: /testing/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sunday still water/i })).toHaveAttribute(
      "href",
      "/today?date=2026-05-17"
    );
    expect(screen.getByRole("heading", { name: /soft breeze orb/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Save" })).toHaveLength(12);
    expect(screen.getAllByText("Daily rotation")).toHaveLength(7);
    expect(screen.getAllByText("Library only")).toHaveLength(5);
    expect(screen.getByText(/\/images\/reflections1.png/i)).toBeInTheDocument();
  });

  test("filters the content board by mood", () => {
    renderTestingPage();

    userEvent.selectOptions(screen.getByLabelText(/mood/i), "ease");

    expect(screen.getByRole("heading", { name: /gentle tide/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /soft breeze orb/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /still water/i })).not.toBeInTheDocument();
  });

  test("saves, reloads, and clears favourites using localStorage", () => {
    renderTestingPage();

    userEvent.click(screen.getAllByRole("button", { name: "Save" })[0]);

    expect(localStorage.getItem("favourites")).toBe(JSON.stringify([1]));
    expect(screen.getByText(/saved ids in localstorage: \[1\]/i)).toBeInTheDocument();

    localStorage.setItem("favourites", JSON.stringify([2]));
    userEvent.click(screen.getByRole("button", { name: /reload saved/i }));

    expect(screen.getByText(/saved ids in localstorage: \[2\]/i)).toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: /clear/i }));

    expect(localStorage.getItem("favourites")).toBe(JSON.stringify([]));
    expect(screen.getByText(/saved ids in localstorage: \[\]/i)).toBeInTheDocument();
  });
});
