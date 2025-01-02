import { get } from "http";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

// Login state context -if user is logged in or not
const LoginStateContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: (value: boolean) => {},
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
