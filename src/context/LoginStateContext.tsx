"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface User {
  username: string;
  name?: string;
}

export const LoginStateContext = createContext<{
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  users: User[];
}>({
  isLoggedIn: false,
  setIsLoggedIn: () => { },
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
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      setIsLoggedIn,
      users,
    }),
    [isLoggedIn, users]
  );

  useEffect(() => {
  }, [isLoggedIn, users]);

  return <LoginStateContext.Provider value={contextValue}>{children}</LoginStateContext.Provider>;
};

export const useLoginState = () => useContext(LoginStateContext);
