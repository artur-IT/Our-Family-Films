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
        <label htmlFor="title">Tytuł</label>
        <input type="text" id="title" defaultValue={title} />
        <label htmlFor="genre">Typ</label>
        <select name="type" id="type">
          <option value="film">Film</option>
          <option value="serial">Serial</option>
        </select>
        <label htmlFor="genre">Gatunek</label>
        <input type="text" id="genre" />
        {/* <label htmlFor="poster">Plakat: {posterPath}</label>
        <input type="text" id="poster" defaultValue={posterPath || ""} /> */}
        <button type="submit">Dodaj film</button>
      </form>
    </div>
  );
};

export default MovieAdd;
