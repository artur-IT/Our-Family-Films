import MovieSearch from "../../api/MovieSearch";
import { useMovie } from "../../context/MovieContext";
import styles from "./MovieAdd.module.css";

const MovieAdd: React.FC = () => {
  const { title, posterPath } = useMovie();

  return (
    <div className={styles.movieAdd}>
      <h2>Dodaj film</h2>
      <MovieSearch />
      <form className={styles.movieAddForm}>
        <label htmlFor="title">Tytuł: {title}</label>
        <input type="text" id="title" />
        <label htmlFor="year">Rok</label>
        <input type="number" id="year" />
        <label htmlFor="genre">Gatunek</label>
        <input type="text" id="genre" />
        <label htmlFor="poster">Plakat: {posterPath}</label>
        <input type="text" id="poster" />
        <button type="submit">Dodaj film</button>
      </form>
    </div>
  );
};

export default MovieAdd;
