import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MovieEdit } from "./MovieEdit";
import { MovieContext } from "@/context/MovieContext";
import { EditModeContext } from "@/context/EditMovieContext";
import { mockMovieContext, mockMovie } from "../Movie/__mocks__/mockData";

describe("MovieEdit Component", () => {
  // Mock function for setEditForm
  const mockSetEditForm = jest.fn();

  // Default props for the component
  const defaultProps = {
    setEditForm: mockSetEditForm,
    movie: mockMovie,
    id: "1",
  };

  // Mock edit context with different user roles
  const createMockEditContext = (user: string) => ({
    isEditMode: true,
    showAddMovie: false,
    user,
    checkUser: jest.fn(),
    toggleShowAddMovie: jest.fn(),
    toggleEditMode: jest.fn(),
  });

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  // Helper function to render the component with context
  const renderMovieEdit = (user = "Artur") => {
    return render(
      <MovieContext.Provider value={mockMovieContext}>
        <EditModeContext.Provider value={createMockEditContext(user)}>
          <MovieEdit {...defaultProps} />
        </EditModeContext.Provider>
      </MovieContext.Provider>
    );
  };

  test("renders MovieEdit component correctly for admin user", () => {
    renderMovieEdit("Artur");

    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Genre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ratings/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Comment/i)).toBeInTheDocument();

    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("renders limited fields for non-admin user", () => {
    renderMovieEdit("User");

    // Check that admin-only fields are not displayed
    expect(screen.queryByLabelText(/Title/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Genre/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Type/i)).not.toBeInTheDocument();

    expect(screen.getByLabelText(/Ratings/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Comment/i)).toBeInTheDocument();

    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("calls setEditForm when Cancel button is clicked", () => {
    renderMovieEdit();

    fireEvent.click(screen.getByText("Cancel"));

    expect(mockSetEditForm).toHaveBeenCalledWith(false);
  });

  test("submits form with updated data when Save button is clicked", async () => {
    renderMovieEdit();

    // Change form values
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: "Updated Title" } });
    fireEvent.change(screen.getByLabelText(/Genre/i), { target: { value: "Updated Genre" } });
    fireEvent.change(screen.getByLabelText(/Comment/i), { target: { value: "Updated Comment" } });

    // Select rating value
    fireEvent.change(screen.getByLabelText(/Ratings/i), { target: { value: "3" } });

    fireEvent.click(screen.getByText("Save"));

    // Check if updateMovie was called with correct data
    await waitFor(() => {
      expect(mockMovieContext.updateMovie).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({
          id: "1",
          title: "Updated Title",
          genre: "Updated Genre",
          ratings: expect.objectContaining({
            Artur: 3,
          }),
          comments: expect.objectContaining({
            Artur: "Updated Comment",
          }),
        })
      );
    });

    // Check if setEditForm was called to close the form
    expect(mockSetEditForm).toHaveBeenCalledWith(false);
  });

  test("initializes form with movie data", () => {
    renderMovieEdit();

    // Check if form fields are initialized with movie data
    const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement;
    const genreInput = screen.getByLabelText(/Genre/i) as HTMLInputElement;
    const typeSelect = screen.getByLabelText(/Type/i) as HTMLSelectElement;

    expect(titleInput.value).toBe(mockMovie.title);
    expect(genreInput.value).toBe(mockMovie.genre);
    expect(typeSelect.value).toBe(mockMovie.type);
  });
});
