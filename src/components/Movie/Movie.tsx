import { useState } from "react";
import style from "./Movie.module.css";
import { PanelAdmin } from "../../layouts/PanelAdmin/PanelAdmin";
import starEmptyIcon from "/star-empty.svg";
import commentsIcon from "/comments.svg";

export const Movie = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const commentsUser = ["komentarz 1", "komentarz 2", "komentarz 3", "komentarz 4"];

  const movieDescription = (
    <div className={style.movie_description}>
      <div className={style.movie_data}>
        <p>Sweet Tooth</p>
        <p>2021</p>
        <p>serial</p>
      </div>

      <div className={style.rating}>
        <img src={starEmptyIcon} alt="star" className={style.star} />
        <img src={starEmptyIcon} alt="star" className={style.star} />
        <img src={starEmptyIcon} alt="star" className={style.star} />
        <span>(2/4)</span>
        <img src={commentsIcon} alt="comments icon" className={style.comments_icon} onClick={() => setIsExpanded(!isExpanded)} />
      </div>

      <div className={style.comments_user}>{isExpanded && commentsUser.map((comment, idx) => <p key={idx}>{comment}</p>)}</div>
    </div>
  );

  return (
    <div className={style.movie} data-expanded={isExpanded}>
      {isLoggedIn && <PanelAdmin />} {movieDescription}
    </div>
  );
};
