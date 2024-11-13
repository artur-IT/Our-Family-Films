import { useState } from "react";
import style from "./Movie.module.css";
import { PanelAdmin } from "../../layouts/PanelAdmin/PanelAdmin";
import starEmptyIcon from "/star-empty.svg";
import starFullIcon from "/star-full.svg";
import commentsIcon from "/comments.svg";

export const Movie = ({
  movie,
  isLoggedIn,
}: {
  movie: { title: string; year: number; genre: string; rating: 1 | 2 | 3; comments: string[] };
  isLoggedIn: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
    <div className={style.movie} data-expanded={isExpanded}>
      {isLoggedIn && <PanelAdmin />} {movieDescription}
    </div>
  );
};
