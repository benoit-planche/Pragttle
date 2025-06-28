import { render, screen } from "@testing-library/react";
import PostCard from "../components/PostCard";

const mockPost = {
  id: 1,
  content: "Test post content",
  author_id: 1,
  author_name: "Test User",
  author_username: "testuser",
  author_avatar_url: undefined,
  likes_count: 10,
  comments_count: 5,
  shares_count: 2,
  is_verified_by_ai: true,
  ai_verification_score: 0.95,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

describe("PostCard Component", () => {
  it("renders post content", () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText("Test post content")).toBeInTheDocument();
  });

  it("renders author name and username", () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("@testuser")).toBeInTheDocument();
  });

  it("renders like and comment counts", () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders AI verification badge", () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText("IA Vérifié")).toBeInTheDocument();
  });
});
