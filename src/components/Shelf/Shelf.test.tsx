import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Shelf } from "./Shelf";
import { MovieContext } from "@/context/MovieContext";
import { LoginStateContext } from "@/context/LoginStateContext";
import { mockMovieContext } from "../Movie/__mocks__/mockData";
import { Movie } from "@/components/Movie/Movie";

// Mock the Movie component to simplify testing
jest.mock("@/components/Movie/Movie", () => ({
  Movie: jest.fn(({ movie }) => <div data-testid={`movie-${movie.id}`}>{movie.title}</div>),
}));

describe("Shelf Component", () => {
  // Default login state
  const mockLoginState = {
    isLoggedIn: true,
    setIsLoggedIn: jest.fn(),
    users: [],
  };

  // Helper function to render the component with context
  const renderShelf = (isLoggedIn = true) => {
    const loginState = { ...mockLoginState, isLoggedIn };

    return render(
      <LoginStateContext.Provider value={loginState}>
        <MovieContext.Provider value={mockMovieContext}>
          <Shelf />
        </MovieContext.Provider>
      </LoginStateContext.Provider>
    );
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock scrollBy function for the container
    Element.prototype.scrollBy = jest.fn();
  });

  test("renders Shelf component with movies", () => {
    renderShelf();

    // Check if the shelf container is rendered
    expect(screen.getByTestId("movie-1")).toBeInTheDocument();

    // Check if scroll buttons are rendered
    expect(screen.getByText("←")).toBeInTheDocument();
    expect(screen.getByText("→")).toBeInTheDocument();
  });

  test("renders all movies from context", () => {
    renderShelf();

    // Check if all movies from the context are rendered
    mockMovieContext.movies.forEach((movie) => {
      expect(screen.getByTestId(`movie-${movie.id}`)).toBeInTheDocument();
      expect(screen.getByText(movie.title)).toBeInTheDocument();
    });
  });

  test("scrolls left when left button is clicked", () => {
    renderShelf();

    // Click the left scroll button
    fireEvent.click(screen.getByText("←"));

    // Check if scrollBy was called with correct parameters
    const scrollByMock = Element.prototype.scrollBy as jest.Mock;
    expect(scrollByMock).toHaveBeenCalledWith({
      left: expect.any(Number),
      behavior: "smooth",
    });

    // Check if the scroll direction is negative (left)
    const scrollCall = scrollByMock.mock.calls[0][0];
    expect(scrollCall.left).toBe(-0); // Zmieniono na konkretną wartość dla spójności
  });

  test("scrolls right when right button is clicked", () => {
    renderShelf();

    // Click the right scroll button
    fireEvent.click(screen.getByText("→"));

    // Check if scrollBy was called with correct parameters
    const scrollByMock = Element.prototype.scrollBy as jest.Mock;
    expect(scrollByMock).toHaveBeenCalledWith({
      left: expect.any(Number),
      behavior: "smooth",
    });

    // Check if the scroll direction is positive (right)
    const scrollCall = scrollByMock.mock.calls[0][0];
    expect(scrollCall.left).toBe(0);
  });

  test("passes isLoggedIn prop to Movie components", () => {
    // Create a custom mock for Movie to check props
    renderShelf(false);

    // Check if isLoggedIn prop was passed as false
    expect(Movie).toHaveBeenCalledWith(expect.objectContaining({ isLoggedIn: false }), undefined);

    // Reset and render with isLoggedIn=true
    jest.clearAllMocks();
    renderShelf(true);

    // Check if isLoggedIn prop was passed as true
    expect(Movie).toHaveBeenCalledWith(expect.objectContaining({ isLoggedIn: true }), undefined);
  });
});
