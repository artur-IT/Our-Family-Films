import { useContext, useEffect, useState } from "react";
import style from "./Movie.module.css";
import starEmptyIcon from "../../../public/star-empty.svg";
import starFullIcon from "../../../public/star-full.svg";
import { MovieData } from "@/types/types";
import Image from "next/image";
import { useEditMode } from "@/context/EditMovieContext";
import { MovieContext } from "@/context/MovieContext";
import { MovieEdit } from "@/components/MovieEdit/MovieEdit";
import MovieAdd from "../MovieAdd/MovieAdd";
import { MovieDeletePopup } from "../MovieDeletePopup/MovieDeletePopup";

export const Movie = ({ movie, isLoggedIn, index = 0 }: { movie: MovieData; isLoggedIn: boolean; index?: number }) => {
  const [showEditForm, setEditForm] = useState(false);
  const [showDeletePopup, setDeletePopup] = useState(false);

  const movieContext = useContext(MovieContext);
  if (!movieContext) throw new Error("Movie must be used within MovieContext.Provider");
  const { deleteMovie, setSelectedMovieId, selectedMovieId } = movieContext;
  const [isVisible, setIsVisible] = useState(false);
  const movieVisibilityClass = isVisible ? style.visible : style.hidden;
  const { isEditMode, showAddMovie, user } = useEditMode();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/movies`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: movie.id }),
      });

      if (response.ok) {
        deleteMovie(movie.id);
        setDeletePopup(!showDeletePopup);
      }
    } catch (error) {
      console.error("Hmmm, error durning delete movie:", error);
    }
  };

  const ratings = movie.ratings || {};
  const totalRatings = Object.values(ratings).reduce((sum, rating) => (sum as number) + (rating as number), 0);
  const averageRating = Object.values(ratings).length > 0 ? (totalRatings as number) / Object.values(ratings).length : 0;

  const hasAnyRating = Object.values(ratings).some((rating) => (rating as number) > 0);

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (setSelectedMovieId) {
      const newSelectedId = selectedMovieId === movie.id ? null : movie.id;
      setSelectedMovieId(newSelectedId);

      if (newSelectedId) {
        setTimeout(() => {
          const movieDetailsElement = document.querySelector('[class*="movieDetailsContainer"]');
          if (movieDetailsElement) {
            movieDetailsElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    }
  };

  useEffect(() => {
    const delay = 200 + index * 600;
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <>
      {showAddMovie && <MovieAdd />}

      <div className={`${style.movie} ${movieVisibilityClass}`} id={movie.id}>
        <div className={style.posterContainer}>
          <Image
            src={movie.info.image}
            alt={`Plakat filmu ${movie.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 4}
            className={style.posterImage}
          />
        </div>

        {showDeletePopup && <MovieDeletePopup delete={handleDelete} deletePopup={() => setDeletePopup(!showDeletePopup)} />}
        {isEditMode && (
          <div className={style.movie_description_edit} style={isEditMode ? { opacity: 1 } : undefined}>
            {/* Edit Form movie description on film poster */}
            {showEditForm && <MovieEdit setEditForm={setEditForm} movie={movie} id={movie.id} />}
            <button className={style.edit_btn} onClick={() => setEditForm(!showEditForm)} disabled={showEditForm} data-testid="edit-button">
              Edit
            </button>

            {user === "Artur" && (
              <button className={style.delete_btn} onClick={() => setDeletePopup(!showDeletePopup)}>
                Delete
              </button>
            )}
          </div>
        )}

        {/* Movie description */}
        <div className={style.movie_description} style={isLoggedIn ? { opacity: 1 } : undefined} id={movie.id}>
          <div className={style.movie_data}>
            <a href={movie.info.link} target="_blank">
              {movie.title}
            </a>
            <p>{`(${movie.type})`}</p>
            <p>{movie.genre}</p>

            <button className={style.infoButton} onClick={handleInfoClick} aria-label="Pokaż szczegóły filmu">
              INFO
            </button>
          </div>

          {/* Rating film (stars)*/}
          <div className={style.rating}>
            {[1, 2, 3].map((star) => (
              <Image
                src={Number(averageRating.toFixed(1)) >= star || (star === 1 && hasAnyRating) ? starFullIcon : starEmptyIcon}
                alt={Number(averageRating.toFixed(0)) >= star || (star === 1 && hasAnyRating) ? "star-full" : "star-empty"}
                className={style.star}
                key={star}
              />
            ))}
          </div>

          {/* User comments */}
          <div className={style.comments_user}>
            {Object.entries(movie.comments || {}).map(([user, comment]) => (
              <div key={user}>
                <span>{user} | </span>
                <span>{comment as string}</span>
                <br />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
