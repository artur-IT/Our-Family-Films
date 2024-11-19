"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { MovieData } from "../types/types";

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
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [selectedPoster, setSelectedPoster] = useState<string>("");

  // get articles from MongoDB - ONLY FOR LOCAL TESTING
  const getMovies = () => {
    return fetch("/api/movies")
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Błąd pobierania filmów:", error));
  };

  useEffect(() => {
    getMovies();
  }, []);
  //----------------------------------------------

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
