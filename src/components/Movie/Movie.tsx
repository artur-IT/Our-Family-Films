import { useState } from "react";
import style from "./Movie.module.css";
import starEmptyIcon from "../../../public/star-empty.svg";
import starFullIcon from "../../../public/star-full.svg";
import commentsIcon from "../../../public/comments.svg";
import { MovieData } from "@/types/types";
import Image from "next/image";
import { MovieEdit } from "@/app/movies/MovieEdit/MovieEdit";

export const Movie = ({ movie, isLoggedIn }: { movie: MovieData; isLoggedIn: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const movieDescription = (
    <div className={style.movie_description} id={movie.id}>
      <div className={style.movie_data}>
        <p>{movie.title}</p>
        <p>{`(${movie.type})`}</p>
        <p>{movie.genre}</p>
      </div>

      <div className={style.rating}>
        <Image src={movie.rating > 0 ? starFullIcon : starEmptyIcon} alt="star" className={style.star} />
        <Image src={movie.rating >= 2 ? starFullIcon : starEmptyIcon} alt="star" className={style.star} />
        <Image src={movie.rating === 3 ? starFullIcon : starEmptyIcon} alt="star" className={style.star} />
        <span>(2/4)</span>
        <Image src={commentsIcon} alt="comments icon" className={style.comments_icon} onClick={() => setIsExpanded(!isExpanded)} />
      </div>

      <div className={style.comments_user}>
        {Object.values(movie.comments).map((value, index) => (
          <div key={index}>
            <p>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={style.movie} data-expanded={isExpanded} style={{ backgroundImage: `url(${movie.image})` }}>
      {isLoggedIn && <MovieEdit />}

      <div className={style.movie_description} style={isLoggedIn ? { opacity: 1 } : undefined} id={movie.id}>
        <div className={style.movie_data}>
          <p>{movie.title}</p>
          <p>{`(${movie.type})`}</p>
          <p>{movie.genre}</p>
        </div>

        <div className={style.rating}>
          <Image src={movie.rating > 0 ? starFullIcon : starEmptyIcon} alt="star" className={style.star} />
          <Image src={movie.rating >= 2 ? starFullIcon : starEmptyIcon} alt="star" className={style.star} />
          <Image src={movie.rating === 3 ? starFullIcon : starEmptyIcon} alt="star" className={style.star} />
          <span>(2/4)</span>
          <Image src={commentsIcon} alt="comments icon" className={style.comments_icon} onClick={() => setIsExpanded(!isExpanded)} />
        </div>

        <div className={style.comments_user}>
          {Object.values(movie.comments).map((value, index) => (
            <div key={index}>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
