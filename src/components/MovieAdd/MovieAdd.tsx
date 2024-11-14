import { useState } from "react";
import MovieSearch from "../../api/MovieSearch";
import { useMovie } from "../../context/MovieContext";
import styles from "./MovieAdd.module.css";
import { MovieData } from "../../types/types";

interface MovieAddProps {
  movieDB: MovieData[];
  setMovieDB: React.Dispatch<React.SetStateAction<MovieData[]>>;
}
const MovieAdd: React.FC<MovieAddProps> = () => {
  const { addMovie, selectedTitle, selectedPoster } = useMovie();
  const [genre, setGenre] = useState("");
  const [type, setType] = useState("film");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Tworzenie nowego obiektu filmu
    const newMovie = {
      id: Date.now(),
      title: selectedTitle,
      genre: genre,
      rating: 0,
      comments: [],
      image: `https://image.tmdb.org/t/p/w500${selectedPoster || ""}`,
    };
    console.log("Dodano nowy film:", newMovie);
    addMovie(newMovie as MovieData);
  };

  return (
    <div className={styles.movieAdd}>
      <h2>Dodaj film</h2>
      <MovieSearch />
      <form className={styles.movieAddForm} onSubmit={handleSubmit}>
        <label htmlFor="title">Tytuł</label>
        <input type="text" id="title" defaultValue={selectedTitle} />
        <label htmlFor="type">Typ</label>
        <select name="type" id="type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="film">Film</option>
          <option value="serial">Serial</option>
        </select>
        <label htmlFor="genre">Gatunek</label>
        <input type="text" id="genre" maxLength={30} value={genre} onChange={(e) => setGenre(e.target.value)} />
        <p>{selectedPoster}</p>
        <button type="submit">Dodaj film</button>
      </form>
    </div>
  );
};

export default MovieAdd;
