import { useContext, useState } from "react";
import style from "./Movie.module.css";
import starEmptyIcon from "../../../public/star-empty.svg";
import starFullIcon from "../../../public/star-full.svg";
import commentsIcon from "../../../public/comments.svg";
import { MovieData } from "@/types/types";
import Image from "next/image";
import { useEditMode } from "@/context/EditMovieContext";
import { MovieContext } from "@/context/MovieContext";
import { MovieEdit } from "@/components/MovieEdit/MovieEdit";
import MovieAdd from "../MovieAdd/MovieAdd";

export const Movie = ({ movie, isLoggedIn }: { movie: MovieData; isLoggedIn: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEditForm, setEditForm] = useState(false);
  const movieContext = useContext(MovieContext);
  if (!movieContext) throw new Error("Movie must be used within MovieContext.Provider");
  const { deleteMovie } = movieContext;
  const { isEditMode, showAddMovie, user } = useEditMode();

  const handleDelete = async () => {
    if (window.confirm("Czy na pewno chcesz usunąć ten film?")) {
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
        }
      } catch (error) {
        console.error("Błąd podczas usuwania filmu:", error);
      }
    }
  };

  // SUM ALL RATINGS FROM ALL USERS
  const totalRatings = Object.values(movie.ratings).reduce((sum, rating) => {
    return (sum as number) + (rating as number);
  }, 0);
  const averageRating = (totalRatings as number) / Object.values(movie.ratings).length;

  return (
    <>
      {showAddMovie && <MovieAdd />}
      <div className={style.movie} id={movie.id} data-expanded={isExpanded} style={{ backgroundImage: `url(${movie.image})` }}>
        {isEditMode && (
          <div className={style.movie_description} style={isEditMode ? { opacity: 1 } : undefined}>
            {/* Edit curtain on film */}
            {showEditForm && <MovieEdit setEditForm={setEditForm} movie={movie} id={movie.id} />}
            <button className={style.edit_btn} onClick={() => setEditForm(!showEditForm)} disabled={showEditForm}>
              Edytuj
            </button>
            {/* If user as Admin show delete button */}
            {user === "Artur" && (
              <button className={style.delete_btn} onClick={handleDelete}>
                Usuń
              </button>
            )}
          </div>
        )}

        {/* Movie description */}
        <div className={style.movie_description} style={isLoggedIn ? { opacity: 1 } : undefined} id={movie.id}>
          <div className={style.movie_data}>
            <p>{movie.title}</p>
            <p>{`(${movie.type})`}</p>
            <p>{movie.genre}</p>
          </div>

          {/* Rating film (stars)*/}
          <div className={style.rating}>
            <Image src={Number(averageRating.toFixed(0)) > 0 ? starFullIcon : starEmptyIcon} alt="star" className={style.star} />
            <Image src={Number(averageRating.toFixed(0)) >= 2 ? starFullIcon : starEmptyIcon} alt="star" className={style.star} />
            <Image src={Number(averageRating.toFixed(0)) >= 3 ? starFullIcon : starEmptyIcon} alt="star" className={style.star} />

            <Image src={commentsIcon} alt="comments icon" className={style.comments_icon} onClick={() => setIsExpanded(!isExpanded)} />
            <span className={style.commentsLength}>({Object.keys(movie.comments).length})</span>
          </div>

          {/* User comments */}
          <div className={style.comments_user}>
            {Object.entries(movie.comments).map(([user, comment]) => (
              <div key={user}>
                <span>{user}: </span>
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
