import React, { useState } from "react";
import { useMovie } from "../context/MovieContext";
import styles from "./MovieSearch.module.css";

const MovieSearch: React.FC = () => {
  const { setSelectedTitle, setSelectedPoster } = useMovie();
  const [movieTitle, setMovieTitle] = useState("");
  const [moviePosters, setMoviePosters] = useState([]);

  const fetchMovieData = (title: string) => {
    setSelectedPoster("");
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&api_key=ad405f3b86fe05aa920a6b1736fdd9db&`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.results.length > 0) {
          console.log(data.results);
          const posters = data.results.map((result: { poster_path: string }) => result.poster_path);
          setMoviePosters(posters);
          setMovieTitle(data.results[0].original_title);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const handleSearch = () => fetchMovieData(movieTitle);

  return (
    <div className={styles.movieSearchContainer}>
      <div className={styles.searchArea}>
        <input
          type="text"
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
          placeholder="Wpisz tytuł filmu"
          className={styles.movieSearchInput}
        />
        <button onClick={handleSearch} className={styles.movieSearchButton}>
          Szukaj
        </button>
      </div>

      <div>
        {moviePosters.length > 0 &&
          moviePosters.map((poster, index) => (
            <img
              key={index}
              src={`https://image.tmdb.org/t/p/w500${poster}`}
              alt={`Movie Poster ${index}`}
              className={styles.moviePoster}
              onClick={() => {
                setSelectedTitle(movieTitle);
                setSelectedPoster(poster);
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default MovieSearch;
