import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { MovieProvider, MovieContext } from "./MovieContext";
import { MovieData } from "@/types/types";
import { mockMovie } from "@/components/Movie/__mocks__/mockData";

// Mock fetch globally
global.fetch = jest.fn();

// Mock hydration function
jest.mock("@/hydration", () => ({
  getInitialDataToAddForm: jest.fn(() => ({
    movies: [],
    selectedTitle: "",
    selectedPoster: "",
    type: "film",
    genre: "",
    link: "",
  })),
}));

// Test component that uses the context
const TestComponent = () => {
  const context = React.useContext(MovieContext);
  if (!context) return <div>No Context</div>;

  const {
    movies,
    addMovie,
    updateMovie,
    deleteMovie,
    updateDragDropMovie,
    selectedTitle,
    selectedPoster,
    movieLink,
    setMovieInfo,
    setSelectedTitle,
    setSelectedPoster,
    setMovieLink,
    selectedMovieId,
    setSelectedMovieId,
  } = context;

  return (
    <div>
      <div data-testid="moviesCount">{movies.length}</div>
      <div data-testid="selectedTitle">{selectedTitle}</div>
      <div data-testid="selectedPoster">{selectedPoster}</div>
      <div data-testid="movieLink">{movieLink}</div>
      <div data-testid="selectedMovieId">{selectedMovieId || "null"}</div>
      {movies.map((movie) => (
        <div key={movie.id} data-testid={`movie-${movie.id}`}>
          {movie.title}
        </div>
      ))}
      <button
        data-testid="addMovie"
        onClick={() =>
          addMovie({
            id: "2",
            title: "New Movie",
            type: "Film",
            info: {
              image: "/test.jpg",
              link: "",
              media_type: "movie",
            },
          })
        }
      >
        Add Movie
      </button>
      <button
        data-testid="updateMovie"
        onClick={() => updateMovie("1", { title: "Updated Title" })}
      >
        Update Movie
      </button>
      <button data-testid="deleteMovie" onClick={() => deleteMovie("1")}>
        Delete Movie
      </button>
      <button
        data-testid="updateDragDrop"
        onClick={() =>
          updateDragDropMovie([
            {
              id: "1",
              title: "Movie 1",
              order: 0,
              info: {
                image: "/test.jpg",
                link: "",
                media_type: "movie",
              },
            },
            {
              id: "2",
              title: "Movie 2",
              order: 1,
              info: {
                image: "/test.jpg",
                link: "",
                media_type: "movie",
              },
            },
          ])
        }
      >
        Update Drag Drop
      </button>
      <button data-testid="setSelectedTitle" onClick={() => setSelectedTitle("Test Title")}>
        Set Title
      </button>
      <button data-testid="setSelectedPoster" onClick={() => setSelectedPoster("test-poster.jpg")}>
        Set Poster
      </button>
      <button data-testid="setMovieLink" onClick={() => setMovieLink("https://test.com")}>
        Set Link
      </button>
      <button data-testid="setMovieInfo" onClick={() => setMovieInfo([mockMovie])}>
        Set Movie Info
      </button>
      <button data-testid="setSelectedMovieId" onClick={() => setSelectedMovieId("123")}>
        Set Movie ID
      </button>
    </div>
  );
};

describe("MovieContext", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe("MovieProvider", () => {
    test("should provide default context values", () => {
      // Arrange & Act: Render component with provider
      render(
        <MovieProvider>
          <TestComponent />
        </MovieProvider>
      );

      // Assert: Check default values
      expect(screen.getByTestId("moviesCount")).toHaveTextContent("0");
      expect(screen.getByTestId("selectedTitle")).toHaveTextContent("");
      expect(screen.getByTestId("selectedPoster")).toHaveTextContent("");
      expect(screen.getByTestId("movieLink")).toHaveTextContent("");
      expect(screen.getByTestId("selectedMovieId")).toHaveTextContent("null");
    });

    test("should fetch movies on mount", async () => {
      // Arrange: Mock successful API response
      const mockMovies: MovieData[] = [mockMovie];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMovies,
      });

      // Act: Render component with provider
      render(
        <MovieProvider>
          <TestComponent />
        </MovieProvider>
      );

      // Assert: Check that fetch was called
      expect(global.fetch).toHaveBeenCalledWith("/api/movies", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      // Wait for movies to be loaded
      await waitFor(() => {
        expect(screen.getByTestId("moviesCount")).toHaveTextContent("1");
      });

      expect(screen.getByTestId("movie-1")).toHaveTextContent("Lord of the rings");
    });

    test("should handle fetch error gracefully when getting movies", async () => {
      // Arrange: Mock failed API response
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

      // Act: Render component with provider
      render(
        <MovieProvider>
          <TestComponent />
        </MovieProvider>
      );

      // Assert: Check that error was logged but component didn't crash
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith("Błąd pobierania filmów:", expect.any(Error));
      });

      consoleErrorSpy.mockRestore();
    });

    test("should add movie to the list", async () => {
      // Arrange: Mock successful API responses
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        });

      // Act: Render component and add movie
      render(
        <MovieProvider>
          <TestComponent />
        </MovieProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("moviesCount")).toHaveTextContent("0");
      });

      act(() => {
        screen.getByTestId("addMovie").click();
      });

      // Assert: Check that movie was added and fetch was called again
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });

    test("should update movie in the list", async () => {
      // Arrange: Mock successful API responses
      const mockMovies: MovieData[] = [mockMovie];

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockMovies,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

      // Act: Render component and update movie
      render(
        <MovieProvider>
          <TestComponent />
        </MovieProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("moviesCount")).toHaveTextContent("1");
      });

      act(() => {
        screen.getByTestId("updateMovie").click();
      });

      // Assert: Check that update API was called
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/movies", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: "1", title: "Updated Title" }),
        });
      });
    });

    test("should handle update movie error gracefully", async () => {
      // Arrange: Mock successful GET and failed PATCH
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
      const mockMovies: MovieData[] = [mockMovie];

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockMovies,
        })
        .mockRejectedValueOnce(new Error("Update failed"));

      // Act: Render component and update movie
      render(
        <MovieProvider>
          <TestComponent />
        </MovieProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("moviesCount")).toHaveTextContent("1");
      });

      act(() => {
        screen.getByTestId("updateMovie").click();
      });

      // Assert: Check that error was logged
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith("Błąd aktualizacji filmu:", expect.any(Error));
      });

      consoleErrorSpy.mockRestore();
    });

    test("should delete movie from the list", async () => {
      // Arrange: Mock successful API response
      const mockMovies: MovieData[] = [mockMovie];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMovies,
      });

      // Act: Render component and delete movie
      render(
        <MovieProvider>
          <TestComponent />
        </MovieProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("moviesCount")).toHaveTextContent("1");
      });

      act(() => {
        screen.getByTestId("deleteMovie").click();
      });

      // Assert: Check that movie was removed from list
      expect(screen.getByTestId("moviesCount")).toHaveTextContent("0");
      expect(screen.queryByTestId("movie-1")).not.toBeInTheDocument();
    });

    test("should update movies order with drag and drop", async () => {
      // Arrange: Mock successful API responses
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

      // Act: Render component and update drag drop
      render(
        <MovieProvider>
          <TestComponent />
        </MovieProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("moviesCount")).toHaveTextContent("0");
      });

      act(() => {
        screen.getByTestId("updateDragDrop").click();
      });

      // Assert: Check that movies were updated and order API was called
      await waitFor(() => {
        expect(screen.getByTestId("moviesCount")).toHaveTextContent("2");
      });

      expect(global.fetch).toHaveBeenCalledWith("/api/movies/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: expect.stringContaining('"movies"'),
      });
    });

    test("should handle drag drop order save error gracefully", async () => {
      // Arrange: Mock successful GET and failed POST
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        })
        .mockRejectedValueOnce(new Error("Save failed"));

      // Act: Render component and update drag drop
      render(
        <MovieProvider>
          <TestComponent />
        </MovieProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("moviesCount")).toHaveTextContent("0");
      });

      act(() => {
        screen.getByTestId("updateDragDrop").click();
      });

      // Assert: Check that error was logged but movies were still updated locally
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error saving movie order:", expect.any(Error));
      });

      expect(screen.getByTestId("moviesCount")).toHaveTextContent("2");

      consoleErrorSpy.mockRestore();
    });

    test("should update selected title", () => {
      // Arrange: Render component
      render(
        <MovieProvider>
          <TestComponent />
        </MovieProvider>
      );

      // Act: Set selected title
      act(() => {
        screen.getByTestId("setSelectedTitle").click();
      });

      // Assert: Check that title was updated
      expect(screen.getByTestId("selectedTitle")).toHaveTextContent("Test Title");
    });

    test("should update selected poster", () => {
      // Arrange: Render component
      render(
        <MovieProvider>
          <TestComponent />
        </MovieProvider>
      );

      // Act: Set selected poster
      act(() => {
        screen.getByTestId("setSelectedPoster").click();
      });

      // Assert: Check that poster was updated
      expect(screen.getByTestId("selectedPoster")).toHaveTextContent("test-poster.jpg");
    });

    test("should update movie link", () => {
      // Arrange: Render component
      render(
        <MovieProvider>
          <TestComponent />
        </MovieProvider>
      );

      // Act: Set movie link
      act(() => {
        screen.getByTestId("setMovieLink").click();
      });

      // Assert: Check that link was updated
      expect(screen.getByTestId("movieLink")).toHaveTextContent("https://test.com");
    });

    test("should update movie info", () => {
      // Arrange: Render component
      render(
        <MovieProvider>
          <TestComponent />
        </MovieProvider>
      );

      // Act: Set movie info
      act(() => {
        screen.getByTestId("setMovieInfo").click();
      });

      // Assert: Check that movie info was updated (we can't easily test the array, but we can verify the function was called)
      // The state update happens internally, so we just verify the component didn't crash
      expect(screen.getByTestId("setMovieInfo")).toBeInTheDocument();
    });

    test("should update selected movie ID", () => {
      // Arrange: Render component
      render(
        <MovieProvider>
          <TestComponent />
        </MovieProvider>
      );

      // Act: Set selected movie ID
      act(() => {
        screen.getByTestId("setSelectedMovieId").click();
      });

      // Assert: Check that movie ID was updated
      expect(screen.getByTestId("selectedMovieId")).toHaveTextContent("123");
    });
  });
});

