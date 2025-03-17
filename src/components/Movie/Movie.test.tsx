import { render, screen, fireEvent } from "@testing-library/react";
import { Movie } from "./Movie";
import { MovieContext } from "@/context/MovieContext";
import { EditModeContext, EditModeProvider } from "@/context/EditMovieContext";
import { mockEditContext, mockMovie, mockMovieContext } from "./__mocks__/mockData";
import { setupFetchMock } from "./__mocks__/mockFetch";

describe("Movie Component", () => {
  const renderMovie = (isLoggedIn = false) => {
    return render(
      <MovieContext.Provider value={mockMovieContext}>
        <EditModeProvider>
          <Movie movie={mockMovie} isLoggedIn={isLoggedIn} />
        </EditModeProvider>
      </MovieContext.Provider>
    );
  };

  test("renders the movie title", () => {
    renderMovie();
    // screen.debug();
    expect(screen.getByText("Lord of the rings")).toBeInTheDocument();
  });

  test("renders the movie genre", () => {
    renderMovie();
    expect(screen.getByText("Fantasy")).toBeInTheDocument();
  });

  test("renders the movie type", () => {
    renderMovie();
    expect(screen.getByText("(Film)")).toBeInTheDocument();
  });

  test("displays user comments", () => {
    renderMovie(true);
    expect(screen.getByText("Great movie!")).toBeInTheDocument();
    expect(screen.getByText("Nice one")).toBeInTheDocument();
  });

  test("does not display edit buttons when not in edit mode", () => {
    renderMovie();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  test("displays rating stars", () => {
    renderMovie();
    const stars = screen.getAllByAltText("star-full");
    expect(stars).toHaveLength(3);
  });
});

//------------------------------------------------------------

describe("Movie Component - additional tests", () => {
  const renderMovie = (isLoggedIn = false) => {
    return render(
      <MovieContext.Provider value={mockMovieContext}>
        <EditModeProvider>
          <Movie movie={mockMovie} isLoggedIn={isLoggedIn} />
        </EditModeProvider>
      </MovieContext.Provider>
    );
  };

  test("delete movie popup appears after clicking the Delete button", () => {
    const { rerender } = renderMovie(true);
    rerender(
      <MovieContext.Provider value={mockMovieContext}>
        <EditModeContext.Provider
          value={{
            ...mockEditContext, // wszystkie domyślne wartości
            user: "Artur", // nadpisujemy tylko user
          }}
        >
          <Movie movie={mockMovie} isLoggedIn={true} />
        </EditModeContext.Provider>
      </MovieContext.Provider>
    );

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    expect(screen.getByText("Are you sure you want to delete this movie?")).toBeInTheDocument();
  });

  test("edit movie form appears after clicking the Edit button", () => {
    const { rerender } = renderMovie(true);
    renderMovie();

    rerender(
      <MovieContext.Provider value={mockMovieContext}>
        <EditModeContext.Provider value={mockEditContext}>
          <Movie movie={mockMovie} isLoggedIn={true} />
        </EditModeContext.Provider>
      </MovieContext.Provider>
    );
    const editButton = screen.getByTestId("edit-button");

    fireEvent.click(editButton);
    const editMovieForm = screen.getByTestId("movie-edit");

    expect(editMovieForm).toBeInTheDocument();
  });

  test("Delete button is visible only for Admin", () => {
    const { rerender } = renderMovie(true);
    rerender(
      <MovieContext.Provider value={mockMovieContext}>
        <EditModeContext.Provider
          value={{
            ...mockEditContext,
            user: "Artur",
          }}
        >
          <Movie movie={mockMovie} isLoggedIn={true} />
        </EditModeContext.Provider>
      </MovieContext.Provider>
    );

    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  test("3 empty stars are displayed", () => {
    const movieWithRatings = {
      ...mockMovie,
      ratings: { user1: 0, user2: 0, user3: 0 },
    };
    renderMovie();
    render(
      <MovieContext.Provider value={{ ...mockMovieContext, movies: [movieWithRatings] }}>
        <EditModeContext.Provider value={mockEditContext}>
          <Movie movie={movieWithRatings} isLoggedIn={true} />
        </EditModeContext.Provider>
      </MovieContext.Provider>
    );

    const fullStars = screen.getAllByRole("img").filter((star) => star.getAttribute("alt")?.includes("star-empty"));
    expect(fullStars).toHaveLength(3);
  });
});

describe("Movie Component with mocked fetch", () => {
  const renderMovie = (isLoggedIn = false) => {
    return render(
      <MovieContext.Provider value={mockMovieContext}>
        <EditModeProvider>
          <Movie movie={mockMovie} isLoggedIn={isLoggedIn} />
        </EditModeProvider>
      </MovieContext.Provider>
    );
  };

  beforeEach(() => {
    setupFetchMock(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("removes the movie after confirmation", async () => {
    const { rerender } = renderMovie(true);
    rerender(
      <MovieContext.Provider value={mockMovieContext}>
        <EditModeContext.Provider
          value={{
            ...mockEditContext,
            user: "Artur",
          }}
        >
          <Movie movie={mockMovie} isLoggedIn={true} />
        </EditModeContext.Provider>
      </MovieContext.Provider>
    );

    // Test logiki usuwania
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByText("Yes");
    await fireEvent.click(confirmButton);

    expect(mockMovieContext.deleteMovie).toHaveBeenCalledWith(mockMovie.id);
  });

  test("handles error during deletion", async () => {
    setupFetchMock(false);

    const { rerender } = renderMovie(true);
    rerender(
      <MovieContext.Provider value={mockMovieContext}>
        <EditModeContext.Provider
          value={{
            ...mockEditContext,
            user: "Artur",
          }}
        >
          <Movie movie={mockMovie} isLoggedIn={true} />
        </EditModeContext.Provider>
      </MovieContext.Provider>
    );

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByText("Yes");
    await fireEvent.click(confirmButton);

    expect(mockMovieContext.deleteMovie).not.toHaveBeenCalled();
  });
});
