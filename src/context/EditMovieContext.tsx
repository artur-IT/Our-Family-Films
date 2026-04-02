"use client";
import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";

type EditModeContextType = {
  isEditMode: boolean; 
  showAddMovie: boolean;
  user: string; 
  checkUser: (value: string) => void; 
  toggleShowAddMovie: () => void;
  toggleEditMode: () => void; 
};

export const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showAddMovie, setShowAddMovie] = useState<boolean>(false);
  const [user, setUser] = useState<string>("us");

  const checkUser = useCallback((value: string) => setUser(value), []);

  const toggleEditMode = useCallback(() => setIsEditMode((prev) => !prev), []);

  const toggleShowAddMovie = useCallback(() => setShowAddMovie((prev) => !prev), []);

  const contextValue = useMemo(
    () => ({
      isEditMode,
      showAddMovie,
      user,
      checkUser,
      toggleShowAddMovie,
      toggleEditMode,
    }),
    [isEditMode, showAddMovie, user, checkUser, toggleShowAddMovie, toggleEditMode]
  );

  return <EditModeContext.Provider value={contextValue}>{children}</EditModeContext.Provider>;
}

export const useEditMode = () => {
  const context = useContext(EditModeContext);

  if (!context) {
    throw new Error("useEditMode must be used within an EditModeProvider");
  }

  return context;
};
