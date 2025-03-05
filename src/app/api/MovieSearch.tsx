"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MovieContext } from "@/context/MovieContext";
import styles from "./MovieSearch.module.css";
import Image from "next/image";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const MovieSearch = ({ clearMovieForm }: { clearMovieForm: () => void }) => {
  const context = useContext(MovieContext);
  const setSelectedTitle = context?.setSelectedTitle;
  const setSelectedPoster = context?.setSelectedPoster;
  const [movieTitle, setMovieTitle] = useState("");
  const postersRef = useRef<HTMLDivElement>(null);
  const [foundMovies, setFoundMovies] = useState<Map<string, string>>(new Map());

  // Close finding posters when clicking outside of the posters div
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (postersRef.current && !postersRef.current.contains(event.target as Node) && !target.className.includes("movieSearchButton")) {
        setFoundMovies(new Map());
        setMovieTitle("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchMoviePoster = (title: string) => {
    clearMovieForm();
    const url = `https://api.themoviedb.org/3/search/multi?include_adult=false&language=pl-PL&page=1&query=${title}&api_key=${TMDB_API_KEY}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.results.length > 0) {
          const newMap = new Map();
          data.results.forEach((result: { title: string; poster_path: string }) => {
            if (result.title || result.poster_path) {
              newMap.set(result.title, result.poster_path);
            }
          });
          setFoundMovies(newMap);
        }
      })
      .catch((error) => {
        console.error("Error durning fetching movie posters:", error);
      });
  };

  const handleSearch = () => searchMoviePoster(movieTitle);

  return (
    <div className={styles.movieSearchContainer}>
      <div className={styles.searchArea}>
        <label>
          Find poster
          <input
            type="text"
            name="movieTitle"
            value={movieTitle}
            onChange={(e) => setMovieTitle(e.target.value)}
            placeholder="enter movie title"
            className={styles.movieSearchInput}
          />
        </label>
        <button onClick={handleSearch} className={styles.movieSearchButton}>
          Search
        </button>
      </div>

      <div ref={postersRef} className={styles.posters}>
        {Array.from(foundMovies).map(([title, poster], index) => (
          <Image
            key={index}
            src={`https://image.tmdb.org/t/p/original${poster}`}
            alt={`Movie Poster ${title}`}
            className={styles.moviePoster}
            width={150}
            height={225}
            onClick={() => {
              if (setSelectedTitle && setSelectedPoster) {
                setSelectedTitle(title);
                setSelectedPoster(poster);
                setFoundMovies(new Map());
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
