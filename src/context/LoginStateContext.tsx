"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

// Interface defining the structure of a user
interface User {
  username: string;
  password: string;
  name: string;
}

// Create context for managing login state across the application
// Login state context - if user is logged in or not
export const LoginStateContext = createContext<{
  isLoggedIn: boolean; // Flag indicating if a user is currently logged in
  setIsLoggedIn: (loggedIn: boolean) => void; // Function to update the login state
  users: User[]; // Array of available users
}>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  users: [],
});

// Provider component that makes login state available to all child components
export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  // State to track if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State to store available users
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

      // Parse and store the user data
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  // Fetch users when the component mounts
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Provide login state and functions to all children
  return <LoginStateContext.Provider value={{ isLoggedIn, setIsLoggedIn, users }}>{children}</LoginStateContext.Provider>;
};

// Custom hook to easily access the login state context
export const useLoginState = () => useContext(LoginStateContext);
