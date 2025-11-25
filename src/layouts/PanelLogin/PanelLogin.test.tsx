import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PanelLogin } from "./PanelLogin";
import { LoginStateContext } from "@/context/LoginStateContext";
import { EditModeProvider } from "@/context/EditMovieContext";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => "/auth"),
}));

global.fetch = jest.fn();

const mockRouter = {
  push: jest.fn(),
};

describe("PanelLogin Component", () => {
  const mockUsers = [{ username: "ar", password: "ar", name: "Admin" }];

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Use fake timers to control setTimeout calls
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore real timers after each test
    jest.useRealTimers();
  });

  const renderPanelLogin = () => {
    return render(
      <LoginStateContext value={{ isLoggedIn: false, setIsLoggedIn: jest.fn(), users: mockUsers }}>
        <EditModeProvider>
          <PanelLogin />
        </EditModeProvider>
      </LoginStateContext>
    );
  };

  test("renders login form with all elements", () => {
    renderPanelLogin();
    // Dodaj to, aby zobaczyć, co jest w DOM
    // screen.debug();
    const loginButton = screen.getByRole("heading", { name: /Login/i });
    expect(loginButton).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("shows error message for invalid credentials", async () => {
    // Mock fetch to return unsuccessful login
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: false }),
    });

    renderPanelLogin();

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: "wrong" } });
    fireEvent.change(passwordInput, { target: { value: "wrong" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Wrong user or password!")).toBeInTheDocument();
    });

    // Verify fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "wrong",
        password: "wrong",
      }),
    });
  });

  test("redirects admin to admin page on successful login", async () => {
    // Mock fetch to return successful login for admin
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        user: {
          username: "ar",
          name: "Admin",
        },
      }),
    });

    renderPanelLogin();

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: "ar" } });
    fireEvent.change(passwordInput, { target: { value: "ar" } });
    fireEvent.click(submitButton);

    // Wait for fetch to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Fast-forward timers to trigger setTimeout in component (ANIMATION_DURATION = 500ms)
    jest.advanceTimersByTime(500);

    // Wait for router.push to be called
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/admin");
    });

    // Verify fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "ar",
        password: "ar",
      }),
    });
  });
});
