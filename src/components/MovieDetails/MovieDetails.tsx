"use client";
import { useContext, useState, useEffect } from "react";
import { MovieContext } from "@/context/MovieContext";
import styles from "./MovieDetails.module.css";
import Image from "next/image";
import { MovieData } from "@/types/types";

export const MovieDetails: React.FC = () => {
  const { movies, selectedMovieId, setSelectedMovieId } = useContext(MovieContext) || {
    movies: [],
    selectedMovieId: null,
    setSelectedMovieId: () => {},
  };
  const [isVisible, setIsVisible] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<MovieData | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  // Funkcja zamykająca okno szczegółów
  const handleClose = () => {
    setIsVisible(false);

    // Po zakończeniu animacji znikania, resetujemy selectedMovieId
    setTimeout(() => {
      setSelectedMovieId(null);
    }, 300);
  };

  // Efekt obsługujący pojawienie się i znikanie komponentu
  useEffect(() => {
    if (selectedMovieId) {
      // Gdy wybrano film, najpierw przygotuj komponent do renderowania
      const movie = movies.find((movie) => movie.id === selectedMovieId);
      if (movie) {
        setCurrentMovie(movie);
        setShouldRender(true);

        // Opóźnij pokazanie komponentu, aby dać czas na renderowanie
        setTimeout(() => {
          setIsVisible(true);
        }, 50);
      }
    } else {
      // Gdy odznaczono film, najpierw ukryj komponent
      setIsVisible(false);

      // Po zakończeniu animacji znikania, przestań renderować komponent
      const timer = setTimeout(() => {
        setShouldRender(false);
        setCurrentMovie(null);
      }, 300); // Czas powinien odpowiadać czasowi animacji CSS

      return () => clearTimeout(timer);
    }
  }, [selectedMovieId, movies]);

  // Jeśli nie powinniśmy renderować komponentu, zwróć null
  if (!shouldRender) return null;

  return (
    <div className={`${styles.movieDetailsContainer} ${isVisible ? styles.visible : styles.hidden}`}>
      <div className={styles.detailsCard}>
        <div className={styles.detailsHeader}>
          <button className={styles.closeButton} onClick={handleClose}>
            &times;
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
                alt={`Plakat filmu ${currentMovie.title}`}
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
              <p>
                <strong>Ocena:</strong> {currentMovie.info.vote_average.toFixed(1)}/10
                {currentMovie.info.vote_count !== undefined && (
                  <span className={styles.voteCount}> ({currentMovie.info.vote_count} głosów)</span>
                )}
              </p>
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
