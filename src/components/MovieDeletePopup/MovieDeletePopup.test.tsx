import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MovieDeletePopup } from "./MovieDeletePopup";

describe("MovieDeletePopup Component", () => {
  // Mock functions passed as props
  const mockDelete = jest.fn();
  const mockDeletePopup = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test("renders MovieDeletePopup component correctly", () => {
    render(<MovieDeletePopup delete={mockDelete} deletePopup={mockDeletePopup} />);

    expect(screen.getByText("Are you sure you want to delete this movie?")).toBeInTheDocument();

    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  test("Yes button calls delete function", () => {
    render(<MovieDeletePopup delete={mockDelete} deletePopup={mockDeletePopup} />);

    fireEvent.click(screen.getByText("Yes"));

    // Check if delete function was called
    expect(mockDelete).toHaveBeenCalledTimes(1);
    // Check if deletePopup function was not called
    expect(mockDeletePopup).not.toHaveBeenCalled();
  });

  test("No button calls deletePopup function", () => {
    render(<MovieDeletePopup delete={mockDelete} deletePopup={mockDeletePopup} />);

    fireEvent.click(screen.getByText("No"));

    expect(mockDeletePopup).toHaveBeenCalledTimes(1);
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test("checks buttons accessibility", () => {
    render(<MovieDeletePopup delete={mockDelete} deletePopup={mockDeletePopup} />);

    // Check if buttons are accessible (not disabled)
    const yesButton = screen.getByText("Yes");
    const noButton = screen.getByText("No");

    expect(yesButton).not.toBeDisabled();
    expect(noButton).not.toBeDisabled();
  });
});
