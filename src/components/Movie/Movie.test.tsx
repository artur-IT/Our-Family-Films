import { render, screen, fireEvent } from "@testing-library/react";
import { Movie } from "./Movie";
import { MovieContext } from "@/context/MovieContext";
import { EditModeContext, EditModeProvider, useEditMode } from "@/context/EditMovieContext";
import { mockEditContext, mockMovie, mockMovieContext } from "./__mocks__/mockData";
import { setupFetchMock } from "./__mocks__/mockFetch";

//------------------------------------------------------------

// describe("Movie Component", () => {
//   const renderMovie = (isLoggedIn = false) => {
//     return render(
//       <MovieContext.Provider value={mockMovieContext}>
//         <EditModeProvider>
//           <Movie movie={mockMovie} isLoggedIn={isLoggedIn} />
//         </EditModeProvider>
//       </MovieContext.Provider>
//     );
//   };

//   test("renders the movie title", () => {
//     renderMovie();
//     // screen.debug();
//     expect(screen.getByText("Lord of the rings")).toBeInTheDocument();
//   });

//   test("renders the movie genre", () => {
//     renderMovie();
//     expect(screen.getByText("Fantasy")).toBeInTheDocument();
//   });

//   test("renders the movie type", () => {
//     renderMovie();
//     expect(screen.getByText("(Film)")).toBeInTheDocument();
//   });

//   test("displays user comments", () => {
//     renderMovie(true);
//     expect(screen.getByText("Great movie!")).toBeInTheDocument();
//     expect(screen.getByText("Nice one")).toBeInTheDocument();
//   });

//   test("does not display edit buttons when not in edit mode", () => {
//     renderMovie();
//     expect(screen.queryByText("Edit")).not.toBeInTheDocument();
//     expect(screen.queryByText("Delete")).not.toBeInTheDocument();
//   });

//   test("displays rating stars", () => {
//     renderMovie();
//     const stars = screen.getAllByAltText("star");
//     expect(stars).toHaveLength(3);
//   });
// });

//------------------------------------------------------------

describe("Movie Component - dodatkowe testy", () => {
  const renderMovie = (isLoggedIn = false) => {
    return render(
      <MovieContext.Provider value={mockMovieContext}>
        <EditModeProvider>
          <Movie movie={mockMovie} isLoggedIn={isLoggedIn} />
        </EditModeProvider>
      </MovieContext.Provider>
    );
  };

  test("popup usuwania filmu pojawia się po kliknięciu przycisku Delete", () => {
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

  // test("formularz edycji pojawia się po kliknięciu przycisku Edit", () => {

  //   const { rerender } = renderMovie(true);
  //   rerender(
  //     <MovieContext.Provider value={mockMovieContext}>
  //       <EditModeProvider>
  //         <Movie movie={mockMovie} isLoggedIn={true} />

  //       </EditModeProvider>
  //     </MovieContext.Provider>
  //   );

  //   const editButton = screen.getByText("Edit");
  //   fireEvent.click(editButton);
  //   expect(screen.getByText("EDIT MOVIE")).toBeInTheDocument();
  // });

  test("przycisk Delete jest widoczny tylko dla Admina", () => {
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

    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  test("wyświetlane są 3 puste gwiazki", () => {
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
    // screen.debug(fullStars);
    expect(fullStars).toHaveLength(3);
  });

  // test("obsługa błędu podczas usuwania filmu", async () => {
  //   global.fetch = jest.fn(() => Promise.reject(new Error("Błąd serwera"))) as jest.Mock;

  //   const consoleSpy = jest.spyOn(console, "error");
  //   const { rerender } = renderMovie(true);

  //   rerender(
  //     <MovieContext.Provider value={mockMovieContext}>
  //       <EditModeProvider>
  //         <Movie movie={mockMovie} isLoggedIn={true} />
  //       </EditModeProvider>
  //     </MovieContext.Provider>
  //   );

  //   const deleteButton = screen.getByText("Delete");
  //   fireEvent.click(deleteButton);

  //   const confirmDelete = screen.getByText("Yes");
  //   fireEvent.click(confirmDelete);

  //   expect(consoleSpy).toHaveBeenCalled();
  //   consoleSpy.mockRestore();
  // });
});

// Przykład użycia w testach:
// describe("Movie Component z mockami", () => {
//   beforeEach(() => {
//     setupFetchMock(true);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test("usuwa film po potwierdzeniu", async () => {
//     render(
//       <MovieContext.Provider value={mockMovieContext}>
//         <EditModeProvider>
//           <Movie movie={mockMovie} isLoggedIn={true} />
//         </EditModeProvider>
//       </MovieContext.Provider>
//     );

//     // Test logiki usuwania
//     const deleteButton = screen.getByText("Delete");
//     fireEvent.click(deleteButton);

//     const confirmButton = screen.getByText("Yes");
//     await fireEvent.click(confirmButton);

//     expect(mockMovieContext.deleteMovie).toHaveBeenCalledWith(mockMovie.id);
//   });

//   test("obsługuje błąd podczas usuwania", async () => {
//     setupFetchMock(false);

//     render(
//       <MovieContext.Provider value={mockMovieContext}>
//         <EditModeProvider>
//           <Movie movie={mockMovie} isLoggedIn={true} />
//         </EditModeProvider>
//       </MovieContext.Provider>
//     );

//     const deleteButton = screen.getByText("Delete");
//     fireEvent.click(deleteButton);

//     const confirmButton = screen.getByText("Yes");
//     await fireEvent.click(confirmButton);

//     expect(mockMovieContext.deleteMovie).not.toHaveBeenCalled();
//   });
// });
