import style from "./Movie.module.css";

export const Movie = () => {
  return (
    <div className={style.movie}>
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
          {/* <p className={style.comments}>komentarze</p> */}
          <img src="/comments.svg" alt="comments" className={style.comments} />
        </div>
      </div>
    </div>
  );
};
