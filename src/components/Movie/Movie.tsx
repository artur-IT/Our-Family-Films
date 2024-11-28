import { useContext, useState } from "react";
import style from "./Movie.module.css";
import starEmptyIcon from "../../../public/star-empty.svg";
import starFullIcon from "../../../public/star-full.svg";
import commentsIcon from "../../../public/comments.svg";
import { MovieData } from "@/types/types";
import Image from "next/image";
// import { MovieEdit } from "@/app/movies/MovieEdit/MovieEdit";
import { useEditMode } from "@/context/EditMovieContext";
import { MovieContext } from "@/context/MovieContext";

export const Movie = ({ movie, isLoggedIn }: { movie: MovieData; isLoggedIn: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const movieContext = useContext(MovieContext);
  if (!movieContext) throw new Error("Movie must be used within MovieContext.Provider");
  const { deleteMovie } = movieContext;
  const { isEditMode } = useEditMode();

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

  return (
    <>
      <div className={style.movie} id={movie.id} data-expanded={isExpanded} style={{ backgroundImage: `url(${movie.image})` }}>
        {/* Edit curtain on film */}
        {/* {isLoggedIn && <MovieEdit />} */}

        {isEditMode && (
          <div className={style.movie_description}>
            <button className={style.edit_btn}>Edytuj</button>
            <button className={style.delete_btn} onClick={handleDelete}>
              Usuń
            </button>
          </div>
        )}

        <div className={style.movie_description} style={isLoggedIn ? { opacity: 1 } : undefined} id={movie.id}>
          <div className={style.movie_data}>
            <p>{movie.title}</p>
            <p>{`(${movie.type})`}</p>
            <p>{movie.genre}</p>
          </div>

          {/* Rating film (stars)*/}
          <div className={style.rating}>
            <Image src={movie.rating > 0 ? starFullIcon : starEmptyIcon} alt="star" className={style.star} />
            <Image src={movie.rating >= 2 ? starFullIcon : starEmptyIcon} alt="star" className={style.star} />
            <Image src={movie.rating === 3 ? starFullIcon : starEmptyIcon} alt="star" className={style.star} />
            <span>(2/4)</span>
            <Image src={commentsIcon} alt="comments icon" className={style.comments_icon} onClick={() => setIsExpanded(!isExpanded)} />
          </div>

          {/* User comments */}
          <div className={style.comments_user}>
            {Object.values(movie.comments).map((value, index) => (
              <div key={index}>
                <p>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
