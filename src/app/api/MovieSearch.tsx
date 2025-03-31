"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MovieContext } from "@/context/MovieContext";
import { MovieData } from "@/types/types";
import styles from "./MovieSearch.module.css";
import Image from "next/image";

// This is the API key for The Movie Database (TMDb) which is used to fetch movie data.
// It is stored in the environment variables for security reasons.
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// interface Movie {
//   title: string;
//   poster_path: string;
//   link: string;
//   id: number;
//   media_type: string;
//   release_date?: string;
//   overview?: string;
//   backdrop_path?: string;
//   vote_average?: number;
//   vote_count?: number;
// }

// This is the main component for searching and displaying movie posters.
// It uses the MovieContext to set the selected title and poster.
// It also has a function to clear the movie form.
const MovieSearch = ({ clearMovieForm }: { clearMovieForm: () => void }) => {
  const context = useContext(MovieContext);
  const setSelectedTitle = context?.setSelectedTitle;
  const setSelectedPoster = context?.setSelectedPoster;
  // const movieInfo = context?.movieInfo;
  const setMovieInfo = context?.setMovieInfo;
  const [movieTitle, setMovieTitle] = useState("");
  const setMovieLink = context?.setMovieLink;
  const postersRef = useRef<HTMLDivElement>(null);
  const [foundMovies, setFoundMovies] = useState<MovieData[]>([]);
  const tempMovieInfo: MovieData[] = [];

  // This effect is used to close the posters when clicking outside of the posters div.
  // It listens for mousedown events and checks if the target is not the posters div or the search button.
  // If it's not, it clears the found movies and the movie title.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (postersRef.current && !postersRef.current.contains(event.target as Node) && !target.className.includes("movieSearchButton")) {
        setFoundMovies([]);
        setMovieTitle("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // This function is used to search for a movie poster.
  // It first clears the movie form, then constructs the URL for the API request.
  // It then fetches the data and if there are results, it creates a new map with the titles and poster paths.
  // Finally, it sets the found movies with the new map.
  const searchMoviePoster = async (title: string) => {
    clearMovieForm();
    const url = `https://api.themoviedb.org/3/search/multi?include_adult=false&language=pl-PL&page=1&query=${title}&api_key=${TMDB_API_KEY}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      // console.log(data);
      if (data.results.length > 0) {
        data.results.forEach((result: any) => {
          const link = `https://www.themoviedb.org/${result.media_type}/${result.id}`;
          if (title || result.poster_path)
            tempMovieInfo.push({
              id: result.id,
              title: result.title || result.name,
              info: {
                image: result.poster_path,
                link: link,
                media_type: result.media_type,
                release_date: result.release_date,
                overview: result.overview,
                backdrop_path: result.backdrop_path,
                vote_average: result.vote_average,
                vote_count: result.vote_count,
              },
            });
        });
        setFoundMovies(tempMovieInfo);
      }
    } catch (error) {
      console.error("Error during fetching movie posters:", error);
    }
  };

  const handleSearch = () => searchMoviePoster(movieTitle);

  // The posters div contains the found movie posters.
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
        {foundMovies.map((movie, index) => (
          <Image
            key={index}
            src={`https://image.tmdb.org/t/p/original${movie.info.image}`}
            alt={`Movie Poster ${movie.title}`}
            className={styles.moviePoster}
            width={150}
            height={225}
            onClick={() => {
              if (setSelectedTitle && setSelectedPoster) {
                setSelectedTitle(movie.title);
                setSelectedPoster(movie.info.image);
                if (setMovieLink) {
                  setMovieLink(movie.info.link);
                }
                if (setMovieInfo) {
                  setMovieInfo([movie]);
                }
                setFoundMovies([]);
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
