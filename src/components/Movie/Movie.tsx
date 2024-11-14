import { useState } from "react";
import style from "./Movie.module.css";
import { PanelAdmin } from "../../layouts/PanelAdmin/PanelAdmin";
import starEmptyIcon from "/star-empty.svg";
import starFullIcon from "/star-full.svg";
import commentsIcon from "/comments.svg";
import { MovieData } from "../../types/types";

export const Movie = ({ movie, isLoggedIn }: { movie: MovieData; isLoggedIn: boolean; orgTitle: string; poster: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  console.log(movie.image);

  const movieDescription = (
    <div className={style.movie_description}>
      <div className={style.movie_data}>
        <p>{movie.title}</p>
        <p>{movie.year}</p>
        <p>{movie.genre}</p>
      </div>

      <div className={style.rating}>
        <img src={movie.rating > 0 ? starFullIcon : starEmptyIcon} alt="star" className={style.star} />
        <img src={movie.rating >= 2 ? starFullIcon : starEmptyIcon} alt="star" className={style.star} />
        <img src={movie.rating == 3 ? starFullIcon : starEmptyIcon} alt="star" className={style.star} />
        <span>(2/4)</span>
        <img src={commentsIcon} alt="comments icon" className={style.comments_icon} onClick={() => setIsExpanded(!isExpanded)} />
      </div>

      <div className={style.comments_user}>
        {movie.comments.map((comment, idx) => (
          <p key={idx}>{comment}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className={style.movie} data-expanded={isExpanded} style={{ backgroundImage: `url(${movie.image})` }}>
      {isLoggedIn && <PanelAdmin />} {movieDescription}
    </div>
  );
};
