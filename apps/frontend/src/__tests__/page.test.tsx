import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("Home Page", () => {
  it("renders Pragttle title in header", () => {
    render(<Home />);

    // Vérifie que le titre Pragttle est présent
    expect(screen.getByText("Pragttle")).toBeInTheDocument();
  });

  it("renders main heading", () => {
    render(<Home />);

    // Check if the main heading is rendered
    expect(screen.getByText(/Le futur du/i)).toBeInTheDocument();
    expect(screen.getByText(/social media/i)).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<Home />);

    // Check if the description is rendered
    expect(
      screen.getByText(/Découvrez une plateforme sociale intelligente/i)
    ).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Home />);

    // Check if navigation links are present
    expect(screen.getByText("Explorer le Feed")).toBeInTheDocument();
    expect(screen.getByText("Découvrir")).toBeInTheDocument();
  });

  it("renders features section", () => {
    render(<Home />);

    // Check if features section is present
    expect(screen.getByText("Pourquoi choisir Pragttle ?")).toBeInTheDocument();
    expect(screen.getByText("IA Intelligente")).toBeInTheDocument();
    expect(screen.getByText("Communauté Engagée")).toBeInTheDocument();
    expect(screen.getByText("Impact Positif")).toBeInTheDocument();
  });

  it("renders call to action", () => {
    render(<Home />);

    // Check if final CTA is present
    expect(
      screen.getByText("Prêt à rejoindre la révolution ?")
    ).toBeInTheDocument();
    expect(screen.getByText("Commencer l'aventure")).toBeInTheDocument();
  });
});
