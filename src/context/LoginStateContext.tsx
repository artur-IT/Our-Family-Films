import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface User {
  username: string;
  password: string;
}

// Login state context - if user is logged in or not
export const LoginStateContext = createContext<{
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  users: User[];
}>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  users: [],
});

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);

  const getUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/auth", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Błąd HTTP: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Błąd pobierania użytkowników:", error);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return <LoginStateContext.Provider value={{ isLoggedIn, setIsLoggedIn, users }}>{children}</LoginStateContext.Provider>;
};

export const useLoginState = () => useContext(LoginStateContext);
