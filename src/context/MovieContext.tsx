"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { MovieData } from "../types/types";
import { getInitialData } from "@/hydration";

interface MovieContextType {
  movies: MovieData[];
  addMovie: (newMovie: MovieData) => void;
  updateMovie: (id: string, updatedData: Partial<MovieData>) => void;
  updateDragDropMovie: (newMovies: MovieData[]) => void;
  deleteMovie: (id: string) => void;
  useMovie: (newMovie: MovieData) => void;
  selectedTitle: string;
  selectedPoster: string;
  setSelectedTitle: (title: string) => void;
  setSelectedPoster: (poster: string) => void;
}

type MovieUpdateData = Partial<MovieData>;

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

  const addMovie = useCallback(
    (newMovie: MovieData) => {
      setMovies((prevMovies) => [...prevMovies, newMovie]);
      setSelectedPoster("");
      getMovies(); // refresh film list
    },
    [getMovies]
  );

  const updateMovie = useCallback(async (movieId: string, updatedData: MovieUpdateData) => {
    try {
      const response = await fetch("/api/movies", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: movieId, ...updatedData }),
      });

      if (!response.ok) {
        throw new Error(`Błąd HTTP: ${response.status}`);
      }

      setMovies((prevMovies) => prevMovies.map((movie) => (movie.id === movieId ? { ...movie, ...updatedData } : movie)));
    } catch (error) {
      console.error("Błąd aktualizacji filmu:", error);
    }
  }, []);

  const saveMovieOrderToDatabase = async (movies: MovieData[]) => {
    try {
      const response = await fetch("/api/movies/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movies }),
      });

      if (!response.ok) {
        throw new Error("Failed to save movie order");
      }

      console.log("Movie order saved successfully");
    } catch (error) {
      console.error("Error saving movie order:", error);
    }
  };

  const updateDragDropMovie = (newMovies: MovieData[]) => {
    setMovies(newMovies);
    saveMovieOrderToDatabase(newMovies);
  };

  const deleteMovie = useCallback((movieId: string) => {
    setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== movieId));
  }, []);

  const useMovie = () => {
    const context = useContext(MovieContext);
    if (!context) {
      throw new Error("useMovie must be used within a MovieProvider");
    }
    return context;
  };

  useEffect(() => {
    getMovies();
  }, [getMovies]);

  return (
    <MovieContext.Provider
      value={{
        movies,
        addMovie,
        deleteMovie,
        updateMovie,
        updateDragDropMovie,
        useMovie,
        selectedTitle,
        selectedPoster,
        setSelectedTitle,
        setSelectedPoster,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
