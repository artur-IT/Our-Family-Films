import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { LoginProvider, useLoginState, LoginStateContext } from "./LoginStateContext";

// Mock fetch globally
global.fetch = jest.fn();

// Test component that uses the context
const TestComponent = () => {
  const { isLoggedIn, setIsLoggedIn, users } = useLoginState();

  return (
    <div>
      <div data-testid="isLoggedIn">{isLoggedIn.toString()}</div>
      <div data-testid="usersCount">{users.length}</div>
      <div data-testid="users">
        {users.map((user, index) => (
          <div key={index} data-testid={`user-${index}`}>
            {user.username}
          </div>
        ))}
      </div>
      <button data-testid="setLoggedIn" onClick={() => setIsLoggedIn(true)}>
        Login
      </button>
      <button data-testid="setLoggedOut" onClick={() => setIsLoggedIn(false)}>
        Logout
      </button>
    </div>
  );
};

// Test component that uses context outside provider (should use default)
const TestComponentWithoutProvider = () => {
  const { isLoggedIn, users } = useLoginState();
  return (
    <div>
      <div data-testid="isLoggedIn">{isLoggedIn.toString()}</div>
      <div data-testid="usersCount">{users.length}</div>
    </div>
  );
};

describe("LoginStateContext", () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    jest.clearAllMocks();
  });

  describe("LoginProvider", () => {
    test("should provide default context values", () => {
      // Arrange & Act: Render component with provider
      render(
        <LoginProvider>
          <TestComponent />
        </LoginProvider>
      );

      // Assert: Check default values
      expect(screen.getByTestId("isLoggedIn")).toHaveTextContent("false");
      expect(screen.getByTestId("usersCount")).toHaveTextContent("0");
    });

    test("should fetch users on mount", async () => {
      // Arrange: Mock successful API response
      const mockUsers = [
        { id: "1", username: "user1", name: "User One" },
        { id: "2", username: "user2", name: "User Two" },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers,
      });

      // Act: Render component with provider
      render(
        <LoginProvider>
          <TestComponent />
        </LoginProvider>
      );

      // Assert: Check that fetch was called
      expect(global.fetch).toHaveBeenCalledWith("/api/auth", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      // Wait for users to be loaded
      await waitFor(() => {
        expect(screen.getByTestId("usersCount")).toHaveTextContent("2");
      });

      expect(screen.getByTestId("user-0")).toHaveTextContent("user1");
      expect(screen.getByTestId("user-1")).toHaveTextContent("user2");
    });

    test("should handle fetch error gracefully", async () => {
      // Arrange: Mock failed API response
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

      // Act: Render component with provider
      render(
        <LoginProvider>
          <TestComponent />
        </LoginProvider>
      );

      // Assert: Check that error was logged but component didn't crash
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching users:", expect.any(Error));
      });

      expect(screen.getByTestId("usersCount")).toHaveTextContent("0");

      consoleErrorSpy.mockRestore();
    });

    test("should handle HTTP error response", async () => {
      // Arrange: Mock HTTP error response
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Act: Render component with provider
      render(
        <LoginProvider>
          <TestComponent />
        </LoginProvider>
      );

      // Assert: Check that error was logged
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching users:", expect.any(Error));
      });

      consoleErrorSpy.mockRestore();
    });

    test("should update isLoggedIn state when setIsLoggedIn is called", () => {
      // Arrange: Render component with provider
      render(
        <LoginProvider>
          <TestComponent />
        </LoginProvider>
      );

      // Assert: Initially logged out
      expect(screen.getByTestId("isLoggedIn")).toHaveTextContent("false");

      // Act: Click login button
      act(() => {
        screen.getByTestId("setLoggedIn").click();
      });

      // Assert: Check that isLoggedIn was updated to true
      expect(screen.getByTestId("isLoggedIn")).toHaveTextContent("true");

      // Act: Click logout button
      act(() => {
        screen.getByTestId("setLoggedOut").click();
      });

      // Assert: Check that isLoggedIn was updated to false
      expect(screen.getByTestId("isLoggedIn")).toHaveTextContent("false");
    });

    test("should handle empty users array", async () => {
      // Arrange: Mock empty API response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      // Act: Render component with provider
      render(
        <LoginProvider>
          <TestComponent />
        </LoginProvider>
      );

      // Assert: Check that users array is empty
      await waitFor(() => {
        expect(screen.getByTestId("usersCount")).toHaveTextContent("0");
      });
    });
  });

  describe("useLoginState hook", () => {
    test("should return default context when used outside provider", () => {
      // Arrange & Act: Render component without provider
      render(<TestComponentWithoutProvider />);

      // Assert: Check that default values are used
      expect(screen.getByTestId("isLoggedIn")).toHaveTextContent("false");
      expect(screen.getByTestId("usersCount")).toHaveTextContent("0");
    });

    test("should return context when used inside provider", () => {
      // Arrange & Act: Render component with provider
      render(
        <LoginProvider>
          <TestComponent />
        </LoginProvider>
      );

      // Assert: Check that component renders without error
      expect(screen.getByTestId("isLoggedIn")).toBeInTheDocument();
    });
  });
});

