import style from "./Movie.module.css";

export const Movie = () => {
  return (
    <div className={style.movie}>
      <div className="movie_description">
        <p>Tytuł</p>
        <p>rok</p>
        <p>gatunek</p>

        <div className="rating">
          <p>gwiazdki</p>
          <span>glosy (2/4)</span>
          <p className="comments">komentarze</p>
        </div>
      </div>
    </div>
  );
};
