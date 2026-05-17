import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Favourites from "./Favourites";
import HeartButton from "../components/HeartButton";

describe("favourites persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("loads saved favourites from localStorage", async () => {
    localStorage.setItem("favourites", JSON.stringify([1]));

    render(<Favourites />);

    expect(await screen.findByRole("heading", { name: /still water/i })).toBeInTheDocument();
    expect(screen.getByText(/what is mine flows to me in perfect measure/i)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /still water/i })).toHaveAttribute(
      "src",
      expect.stringContaining("/images/reflections1.png")
    );
  });

  test("persists a newly saved favourite across page renders", async () => {
    const { unmount } = render(<HeartButton reflectionId={1} />);

    userEvent.click(screen.getByRole("button", { name: /save to favourites/i }));

    expect(localStorage.getItem("favourites")).toBe(JSON.stringify([1]));

    unmount();
    render(<Favourites />);

    expect(await screen.findByRole("heading", { name: /still water/i })).toBeInTheDocument();
  });

  test("removes favourites from the page and localStorage", async () => {
    localStorage.setItem("favourites", JSON.stringify([1]));

    render(<Favourites />);

    userEvent.click(await screen.findByRole("button", { name: /remove/i }));

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: /still water/i })).not.toBeInTheDocument();
    });
    expect(localStorage.getItem("favourites")).toBe(JSON.stringify([]));
    expect(screen.getByText(/your favourites will appear here/i)).toBeInTheDocument();
  });
});
