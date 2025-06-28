import { render, screen } from "@testing-library/react";
import PostCard from "../components/PostCard";

const mockPost = {
  id: "1",
  content: "Test post content",
  author: {
    name: "Test User",
    username: "testuser",
    avatar: undefined,
  },
  createdAt: "2024-01-01T00:00:00Z",
  likes: 10,
  comments: 5,
  isLiked: false,
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

    expect(screen.getByText("Share")).toBeInTheDocument();
  });
});
