"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type EditModeContextType = {
  isEditMode: boolean;
  toggleEditMode: () => void;
};

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  return <EditModeContext.Provider value={{ isEditMode, toggleEditMode }}>{children}</EditModeContext.Provider>;
}

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error("useEditMode must be used within an EditModeProvider");
  }
  return context;
};
