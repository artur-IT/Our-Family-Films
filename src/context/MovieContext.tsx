import React, { createContext, useContext, useEffect, useState } from "react";
import { MovieData } from "../types/types";

interface MovieContextType {
  movies: MovieData[];
  addMovie: (newMovie: MovieData) => void;
  selectedTitle: string;
  selectedPoster: string;
  setSelectedTitle: (title: string) => void;
  setSelectedPoster: (poster: string) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [selectedPoster, setSelectedPoster] = useState<string>("");

  // get articles from MongoDB - ONLY FOR LOCAL TESTING
  const getPosts = () => {
    return fetch("http://localhost:3000/api/getArticles")
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Błąd:", error));
  };

  useEffect(() => {
    getPosts();
  }, []);
  //----------------------------------------------

  const addMovie = (newMovie: MovieData) => {
    setMovies((prevMovies) => [...prevMovies, newMovie]);
    setSelectedPoster("");
  };

  return (
    <MovieContext.Provider value={{ movies, addMovie, selectedTitle, selectedPoster, setSelectedTitle, setSelectedPoster }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovie = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovie must be used within a MovieProvider");
  }
  return context;
};
