// src/context/MovieContext.tsx
import React, { createContext, useContext, useState } from "react";

interface MovieContextType {
  title: string;
  posterPath: string | null;
  setMovie: (title: string, posterPath: string | null) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState("");
  const [posterPath, setPosterPath] = useState<string | null>(null);

  const setMovie = (newTitle: string, newPosterPath: string | null) => {
    setTitle(newTitle);
    setPosterPath(newPosterPath);
  };

  return <MovieContext.Provider value={{ title, posterPath, setMovie }}>{children}</MovieContext.Provider>;
};

export const useMovie = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovie must be used within a MovieProvider");
  }
  return context;
};
