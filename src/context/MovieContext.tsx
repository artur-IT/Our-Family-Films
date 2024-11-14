import React, { createContext, useContext, useState } from "react";
import { MovieData } from "../types/types";

const movieDB: MovieData[] = [
  {
    id: 1,
    title: "Rambo",
    genre: "Action",
    rating: 1,
    comments: ["Komentarz 1", "Komentarz 2", "Komentarz 3"],
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    title: "Rambo II",
    genre: "Action",
    rating: 2,
    comments: ["Komentarz 1", "Komentarz 2"],
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    title: "Rambo III",
    genre: "Action",
    rating: 3,
    comments: ["Komentarz 1"],
    image: "https://via.placeholder.com/150",
  },
];

interface MovieContextType {
  movies: MovieData[];
  addMovie: (newMovie: MovieData) => void;
  selectedTitle: string;
  selectedPoster: string;
  setSelectedTitle: (title: string) => void;
  setSelectedPoster: (poster: string) => void; // Funkcja do ustawiania plakatu
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<MovieData[]>(movieDB);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [selectedPoster, setSelectedPoster] = useState<string>("");

  const addMovie = (newMovie: MovieData) => {
    setMovies((prevMovies) => [...prevMovies, newMovie]);
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
