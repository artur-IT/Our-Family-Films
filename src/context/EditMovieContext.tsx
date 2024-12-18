"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type EditModeContextType = {
  isEditMode: boolean;
  showAddMovie: boolean;
  user: string;
  checkUser: (value: string) => void;
  toggleShowAddMovie: () => void;
  toggleEditMode: () => void;
};

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showAddMovie, setShowAddMovie] = useState<boolean>(false);
  const [user, setUser] = useState<string>("us");

  const checkUser = (value: string) => setUser(value);
  const toggleEditMode = () => setIsEditMode((prev) => !prev);
  const toggleShowAddMovie = () => setShowAddMovie((prev) => !prev);

  return (
    <EditModeContext.Provider value={{ isEditMode, showAddMovie, user, checkUser, toggleShowAddMovie, toggleEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
}

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error("useEditMode must be used within an EditModeProvider");
  }
  return context;
};
