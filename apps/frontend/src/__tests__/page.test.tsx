import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("Home Page", () => {
  it("renders Pragttle title in header", () => {
    render(<Home />);

    // Vérifie qu'au moins un h1 contient Pragttle
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings.some((h) => h.textContent?.match(/Pragttle/i))).toBe(true);
  });

  it("renders welcome message", () => {
    render(<Home />);

    // Check if the welcome message is rendered
    expect(screen.getByText(/Bienvenue sur/i)).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Home />);

    // Check if navigation links are present (use getAllByText for multiple matches)
    const feedLinks = screen.getAllByText(/Feed/i);
    expect(feedLinks.length).toBeGreaterThan(0);

    const exploreLinks = screen.getAllByText(/Explorer/i);
    expect(exploreLinks.length).toBeGreaterThan(0);
  });

  it("renders call to action buttons", () => {
    render(<Home />);

    // Check if CTA buttons are present
    expect(screen.getByText(/Commencer maintenant/i)).toBeInTheDocument();
    expect(screen.getByText(/Voir le Feed/i)).toBeInTheDocument();
  });
});
