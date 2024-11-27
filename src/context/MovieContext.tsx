"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { MovieData } from "../types/types";
import { getInitialData } from "@/hydration";

interface MovieContextType {
  movies: MovieData[];
  addMovie: (newMovie: MovieData) => void;
  useMovie: (newMovie: MovieData) => void;
  selectedTitle: string;
  selectedPoster: string;
  setSelectedTitle: (title: string) => void;
  setSelectedPoster: (poster: string) => void;
}

export const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialData = getInitialData();
  const [movies, setMovies] = useState<MovieData[]>(initialData.movies);
  const [selectedTitle, setSelectedTitle] = useState(initialData.selectedTitle);
  const [selectedPoster, setSelectedPoster] = useState(initialData.selectedPoster);

  // get movies from MongoDB
  const getMovies = useCallback(async () => {
    try {
      const response = await fetch("/api/movies", {
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
      setMovies(data);
    } catch (error) {
      console.error("Błąd pobierania filmów:", error);
    }
  }, []);

  useEffect(() => {
    getMovies();
  }, [getMovies]);

  const addMovie = (newMovie: MovieData) => {
    setMovies((prevMovies) => [...prevMovies, newMovie]);
    setSelectedPoster("");
  };

  const useMovie = () => {
    const context = useContext(MovieContext);
    if (!context) {
      throw new Error("useMovie must be used within a MovieProvider");
    }
    return context;
  };

  return (
    <MovieContext.Provider value={{ movies, addMovie, useMovie, selectedTitle, selectedPoster, setSelectedTitle, setSelectedPoster }}>
      {children}
    </MovieContext.Provider>
  );
};
