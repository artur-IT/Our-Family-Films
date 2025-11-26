import React from "react";
import { render, screen, act } from "@testing-library/react";
import { EditModeProvider, useEditMode, EditModeContext } from "./EditMovieContext";

// Test component that uses the context
const TestComponent = () => {
  const { isEditMode, showAddMovie, user, checkUser, toggleShowAddMovie, toggleEditMode } = useEditMode();

  return (
    <div>
      <div data-testid="isEditMode">{isEditMode.toString()}</div>
      <div data-testid="showAddMovie">{showAddMovie.toString()}</div>
      <div data-testid="user">{user}</div>
      <button data-testid="checkUser" onClick={() => checkUser("testuser")}>
        Set User
      </button>
      <button data-testid="toggleEditMode" onClick={toggleEditMode}>
        Toggle Edit Mode
      </button>
      <button data-testid="toggleShowAddMovie" onClick={toggleShowAddMovie}>
        Toggle Show Add Movie
      </button>
    </div>
  );
};

// Test component that uses context outside provider (should throw error)
const TestComponentWithoutProvider = () => {
  try {
    useEditMode();
    return <div>No Error</div>;
  } catch (error) {
    return <div data-testid="error">{(error as Error).message}</div>;
  }
};

describe("EditMovieContext", () => {
  describe("EditModeProvider", () => {
    test("should provide default context values", () => {
      // Arrange & Act: Render component with provider
      render(
        <EditModeProvider>
          <TestComponent />
        </EditModeProvider>
      );

      // Assert: Check default values
      expect(screen.getByTestId("isEditMode")).toHaveTextContent("false");
      expect(screen.getByTestId("showAddMovie")).toHaveTextContent("false");
      expect(screen.getByTestId("user")).toHaveTextContent("us");
    });

    test("should update user when checkUser is called", () => {
      // Arrange: Render component with provider
      render(
        <EditModeProvider>
          <TestComponent />
        </EditModeProvider>
      );

      // Act: Click button to set user
      act(() => {
        screen.getByTestId("checkUser").click();
      });

      // Assert: Check that user was updated
      expect(screen.getByTestId("user")).toHaveTextContent("testuser");
    });

    test("should toggle edit mode when toggleEditMode is called", () => {
      // Arrange: Render component with provider
      render(
        <EditModeProvider>
          <TestComponent />
        </EditModeProvider>
      );

      // Act: Click button to toggle edit mode
      act(() => {
        screen.getByTestId("toggleEditMode").click();
      });

      // Assert: Check that edit mode was toggled to true
      expect(screen.getByTestId("isEditMode")).toHaveTextContent("true");

      // Act: Toggle again
      act(() => {
        screen.getByTestId("toggleEditMode").click();
      });

      // Assert: Check that edit mode was toggled back to false
      expect(screen.getByTestId("isEditMode")).toHaveTextContent("false");
    });

    test("should toggle showAddMovie when toggleShowAddMovie is called", () => {
      // Arrange: Render component with provider
      render(
        <EditModeProvider>
          <TestComponent />
        </EditModeProvider>
      );

      // Act: Click button to toggle show add movie
      act(() => {
        screen.getByTestId("toggleShowAddMovie").click();
      });

      // Assert: Check that showAddMovie was toggled to true
      expect(screen.getByTestId("showAddMovie")).toHaveTextContent("true");

      // Act: Toggle again
      act(() => {
        screen.getByTestId("toggleShowAddMovie").click();
      });

      // Assert: Check that showAddMovie was toggled back to false
      expect(screen.getByTestId("showAddMovie")).toHaveTextContent("false");
    });

    test("should allow multiple state changes independently", () => {
      // Arrange: Render component with provider
      render(
        <EditModeProvider>
          <TestComponent />
        </EditModeProvider>
      );

      // Act: Change multiple states
      act(() => {
        screen.getByTestId("checkUser").click();
        screen.getByTestId("toggleEditMode").click();
        screen.getByTestId("toggleShowAddMovie").click();
      });

      // Assert: Check that all states were updated correctly
      expect(screen.getByTestId("user")).toHaveTextContent("testuser");
      expect(screen.getByTestId("isEditMode")).toHaveTextContent("true");
      expect(screen.getByTestId("showAddMovie")).toHaveTextContent("true");
    });
  });

  describe("useEditMode hook", () => {
    test("should throw error when used outside provider", () => {
      // Arrange & Act: Render component without provider
      render(<TestComponentWithoutProvider />);

      // Assert: Check that error message is displayed
      expect(screen.getByTestId("error")).toHaveTextContent("useEditMode must be used within an EditModeProvider");
    });

    test("should return context when used inside provider", () => {
      // Arrange & Act: Render component with provider
      render(
        <EditModeProvider>
          <TestComponent />
        </EditModeProvider>
      );

      // Assert: Check that component renders without error
      expect(screen.getByTestId("isEditMode")).toBeInTheDocument();
    });
  });
});

