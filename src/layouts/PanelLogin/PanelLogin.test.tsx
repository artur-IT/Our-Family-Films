import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PanelLogin } from "./PanelLogin";
import { LoginStateContext } from "@/context/LoginStateContext";
import { EditModeProvider } from "@/context/EditMovieContext";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => "/auth"),
}));

const mockRouter = {
  push: jest.fn(),
};

describe("PanelLogin Component", () => {
  const mockUsers = [{ username: "ar", password: "ar", name: "Admin" }];

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
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
  });

  test("redirects admin to admin page on successful login", async () => {
    renderPanelLogin();

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: "ar" } });
    fireEvent.change(passwordInput, { target: { value: "ar" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/admin");
    });
  });
});
