import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";
import { LoginStateContext } from "@/context/LoginStateContext";
import { EditModeProvider } from "@/context/EditMovieContext";

// Mock EditModeProvider
const MockEditModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the context directly without passing value
  return <EditModeProvider>{children}</EditModeProvider>;
};

describe("Header Component", () => {
  const renderHeader = (isLoggedIn = false) => {
    return render(
      <LoginStateContext value={{ isLoggedIn, setIsLoggedIn: jest.fn(), users: [] }}>
        <MockEditModeProvider>
          <Header panelLogin={<div>Login Panel</div>} />
        </MockEditModeProvider>
      </LoginStateContext>
    );
  };

  test("renders header with title", () => {
    renderHeader();
    expect(screen.getByText(/Good Family Movies/i)).toBeInTheDocument();
  });

  test("shows login button when not logged in", () => {
    renderHeader(false);
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  test("shows logout button when logged in", () => {
    renderHeader(true);
    expect(screen.getByRole("button", { name: /Logout/i })).toBeInTheDocument();
  });
});
