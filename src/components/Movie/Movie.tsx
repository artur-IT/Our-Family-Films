import { useState } from "react";
import style from "./Movie.module.css";

export const Movie = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const commentsUser = ["komentarz 1", "komentarz 2", "komentarz 3", "komentarz 4"];

  return (
    <div className={style.movie} data-expanded={isExpanded}>
      <div className={style.movie_description}>
        <div className={style.movie_data}>
          <p>Sweet Tooth</p>
          <p>2021</p>
          <p>serial</p>
        </div>

        <div className={style.rating}>
          <img src="/star-empty.svg" alt="star" className={style.star} />
          <img src="/star-empty.svg" alt="star" className={style.star} />
          <img src="/star-empty.svg" alt="star" className={style.star} />
          <span>(2/4)</span>
          <img src="/comments.svg" alt="comments icon" className={style.comments_icon} onClick={() => setIsExpanded(!isExpanded)} />
        </div>

        <div className={style.comments_user}>{isExpanded && commentsUser.map((comment, idx) => <p key={idx}>{comment}</p>)}</div>
      </div>
    </div>
  );
};
