"use client";
import { useContext, useState, useEffect } from "react";
import { MovieContext } from "@/context/MovieContext";
import styles from "./MovieDetails.module.css";
import Image from "next/image";
import { MovieData } from "@/types/types";
import RatingBar from "../RatingBar/RatingBar";

export const MovieDetails: React.FC = () => {
  const { movies, selectedMovieId, setSelectedMovieId } = useContext(MovieContext) || {
    movies: [],
    selectedMovieId: null,
    setSelectedMovieId: () => {},
  };
  const [isVisible, setIsVisible] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<MovieData | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  // Close movie detail window
  const handleClose = () => {
    setIsVisible(false);

    // After the disappearance animation is finished, we reset the selectedMovieId
    setTimeout(() => {
      setSelectedMovieId(null);
    }, 300);
  };

  // Effect handling the appearance and disappearance of the component
  useEffect(() => {
    if (selectedMovieId) {
      // When a movie is selected, first prepare the component for rendering
      const movie = movies.find((movie) => movie.id === selectedMovieId);
      if (movie) {
        setCurrentMovie(movie);
        setShouldRender(true);

        // Delay showing the component to give time for rendering
        setTimeout(() => {
          setIsVisible(true);
        }, 50);
      }
    } else {
      // When a movie is deselected, first hide the component
      setIsVisible(false);

      // After the disappearance animation is finished, stop rendering the component
      const timer = setTimeout(() => {
        setShouldRender(false);
        setCurrentMovie(null);
      }, 300); // Time should match the CSS animation time

      return () => clearTimeout(timer);
    }
  }, [selectedMovieId, movies]);

  // If we shouldn't render the component, return null
  if (!shouldRender) return null;

  return (
    <div className={`${styles.movieDetailsContainer} ${isVisible ? styles.visible : styles.hidden}`}>
      <div className={styles.detailsCard}>
        <div className={styles.detailsHeader}>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>

          <h3>{currentMovie?.title}</h3>
          {currentMovie?.type && <span className={styles.type}>{currentMovie.type}</span>}
          {currentMovie?.genre && <span className={styles.genre}>{currentMovie.genre}</span>}
        </div>

        <div className={styles.detailsContent}>
          <div className={styles.posterContainer}>
            {currentMovie?.info.image && (
              <Image
                src={currentMovie.info.image}
                alt={`Movie poster ${currentMovie.title}`}
                width={200}
                height={300}
                className={styles.poster}
              />
            )}
          </div>

          <div className={styles.infoContainer}>
            {currentMovie?.info.release_date && (
              <p>
                <strong>Data premiery:</strong> {new Date(currentMovie.info.release_date).toLocaleDateString("pl-PL")}
              </p>
            )}

            {currentMovie?.info.vote_average !== undefined && (
              <div className={styles.ratingContainer}>
                <strong>Ocena:</strong>
                <RatingBar rating={currentMovie.info.vote_average} />
                {currentMovie.info.vote_count !== undefined && (
                  <span className={styles.voteCount}> ({currentMovie.info.vote_count} głosów)</span>
                )}
              </div>
            )}

            {currentMovie?.info.overview && (
              <div className={styles.overview}>
                <strong>Opis</strong>
                <p>{currentMovie.info.overview}</p>
              </div>
            )}

            {currentMovie?.info.link && (
              <div className={styles.linkContainer}>
                <a href={currentMovie.info.link} target="_blank" rel="noopener noreferrer" className={styles.movieLink}>
                  Zobacz więcej
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
