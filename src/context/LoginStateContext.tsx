"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface User {
  username: string;
  name?: string;
}

// Create context for managing login state across the application
export const LoginStateContext = createContext<{
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  users: User[];
}>({
  isLoggedIn: false,
  setIsLoggedIn: () => { },
  users: [],
});

// Provider component that makes login state available to all child components
export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);

  // Function to fetch users from the API
  // Using useCallback to prevent unnecessary re-renders
  const getUsers = useCallback(async () => {
    try {
      // Fetch users from the authentication API
      const response = await fetch("/api/auth", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Prevent caching of sensitive authentication data
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

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      setIsLoggedIn,
      users,
    }),
    [isLoggedIn, users]
  );

  return <LoginStateContext.Provider value={contextValue}>{children}</LoginStateContext.Provider>;
};

// Custom hook to easily access the login state context
export const useLoginState = () => useContext(LoginStateContext);
