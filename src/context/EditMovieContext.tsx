"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// Type definition for the EditModeContext
type EditModeContextType = {
  isEditMode: boolean; // Flag indicating if edit mode is active
  showAddMovie: boolean; // Flag indicating if add movie form should be displayed
  user: string; // Current user identifier
  checkUser: (value: string) => void; // Function to set the current user
  toggleShowAddMovie: () => void; // Function to toggle add movie form visibility
  toggleEditMode: () => void; // Function to toggle edit mode
};

export const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

// Provider component that wraps parts of the app that need access to the edit mode context
export function EditModeProvider({ children }: { children: ReactNode }) {
  // State for edit mode, add movie form visibility, and current user
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showAddMovie, setShowAddMovie] = useState<boolean>(false);
  const [user, setUser] = useState<string>("us");

  // Function to set the current user
  const checkUser = (value: string) => setUser(value);

  // Function to toggle edit mode state
  const toggleEditMode = () => setIsEditMode((prev) => !prev);

  // Function to toggle add movie form visibility
  const toggleShowAddMovie = () => setShowAddMovie((prev) => !prev);

  // Provide the context values to all children components
  return (
    <EditModeContext.Provider value={{ isEditMode, showAddMovie, user, checkUser, toggleShowAddMovie, toggleEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
}

// Custom hook to use the edit mode context
export const useEditMode = () => {
  const context = useContext(EditModeContext);

  // Throw an error if the hook is used outside of the EditModeProvider
  if (!context) {
    throw new Error("useEditMode must be used within an EditModeProvider");
  }

  return context;
};
