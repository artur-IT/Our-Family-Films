import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MovieAdd from "./MovieAdd";
import { MovieContext } from "@/context/MovieContext";
import { EditModeContext } from "@/context/EditMovieContext";
import { mockMovieContext } from "../Movie/__mocks__/mockData";
import { mockEditContext } from "../Movie/__mocks__/mockData";
import { setupFetchMock } from "../Movie/__mocks__/mockFetch";

// Mock modułu MovieSearch
jest.mock("@/app/api/MovieSearch", () => {
  return function MockMovieSearch({ clearMovieForm }: { clearMovieForm: () => void }) {
    return <div data-testid="movie-search">Movie Search Component</div>;
  };
});

// Mock for uuid
jest.mock("uuid", () => ({
  v4: () => "123-456-789",
}));

describe("MovieAdd Component", () => {
  beforeEach(() => {
    // Setting up a mock for fetch before each test
    setupFetchMock(true);
  });

  const renderMovieAdd = () => {
    return render(
      <MovieContext.Provider value={mockMovieContext}>
        <EditModeContext.Provider value={mockEditContext}>
          <MovieAdd />
        </EditModeContext.Provider>
      </MovieContext.Provider>
    );
  };

  test("renders the MovieAdd component correctly", () => {
    renderMovieAdd();

    // Checking if the main elements are rendered
    expect(screen.getByText("Add new movie")).toBeInTheDocument();
    expect(screen.getByTestId("movie-search")).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Species/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Poster/i)).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("fills out the form and sends data", async () => {
    renderMovieAdd();

    // Filling out the form
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: "Test Movie" } });
    fireEvent.change(screen.getByLabelText(/Species/i), { target: { value: "Action" } });
    fireEvent.change(screen.getByLabelText(/Type/i), { target: { value: "Film" } });

    fireEvent.click(screen.getByText("Add"));

    // Check if fetch has been called with the correct parameters
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.any(String),
      });
    });

    // Check if the addMovie function from the context has been called
    await waitFor(() => {
      expect(mockMovieContext.addMovie).toHaveBeenCalled();
    });
  });

  test("Cancel button calls toggleShowAddMovie", () => {
    renderMovieAdd();

    fireEvent.click(screen.getByText("Cancel"));

    // Check if the toggleShowAddMovie function has been called
    expect(mockEditContext.toggleShowAddMovie).toHaveBeenCalled();
  });

  test("updates the title when selectedTitle changes", () => {
    const updatedMockMovieContext = {
      ...mockMovieContext,
      selectedTitle: "Selected Movie Title",
    };

    render(
      <MovieContext.Provider value={updatedMockMovieContext}>
        <EditModeContext.Provider value={mockEditContext}>
          <MovieAdd />
        </EditModeContext.Provider>
      </MovieContext.Provider>
    );

    // Check if the title field contains the selected title
    const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement;
    expect(titleInput.value).toBe("Selected Movie Title");
  });
});
