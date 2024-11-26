"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MovieContext } from "@/context/MovieContext";
import styles from "./MovieSearch.module.css";
import Image from "next/image";

const MovieSearch: React.FC = () => {
  const context = useContext(MovieContext);
  const setSelectedTitle = context?.setSelectedTitle;
  const setSelectedPoster = context?.setSelectedPoster;
  const [movieTitle, setMovieTitle] = useState("");
  const [moviePosters, setMoviePosters] = useState([]);
  const postersRef = useRef<HTMLDivElement>(null);

  // Close finding posters when clicking outside of the posters div
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (postersRef.current && !postersRef.current.contains(event.target as Node)) {
        setMoviePosters([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchMoviePoster = (title: string) => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${title}&api_key=ad405f3b86fe05aa920a6b1736fdd9db&`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.results.length > 0) {
          const posters = data.results
            .filter((result: { poster_path: string }) => result.poster_path !== null)
            .map((result: { poster_path: string }) => result.poster_path);
          setMoviePosters(posters);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const handleSearch = () => searchMoviePoster(movieTitle);

  return (
    <div className={styles.movieSearchContainer}>
      <div className={styles.searchArea}>
        <input
          type="text"
          name="movieTitle"
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
          placeholder="Wpisz tytuł filmu"
          className={styles.movieSearchInput}
        />
        <button onClick={handleSearch} className={styles.movieSearchButton}>
          Szukaj
        </button>
      </div>

      <div ref={postersRef} className={styles.posters}>
        {moviePosters.length > 0 &&
          moviePosters.map((poster, index) => (
            <Image
              key={index}
              src={`https://image.tmdb.org/t/p/w500${poster}`}
              alt={`Movie Poster ${index}`}
              className={styles.moviePoster}
              width={150}
              height={225}
              onClick={() => {
                if (setSelectedTitle && setSelectedPoster) {
                  setSelectedTitle(movieTitle);
                  setSelectedPoster(poster);
                  setMoviePosters([]);
                  setMovieTitle("");
                }
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default MovieSearch;
