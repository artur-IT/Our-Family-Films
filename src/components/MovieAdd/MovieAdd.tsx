import { useState } from "react";
import MovieSearch from "@/app/api/MovieSearch";
import { useMovie } from "@/context/MovieContext";
import styles from "./MovieAdd.module.css";
import { MovieData } from "@/types/types";

interface MovieAddProps {
  movieDB?: MovieData[];
  setMovieDB?: (value: MovieData[]) => void;
  setLoginIn: (value: boolean) => void;
}
const MovieAdd: React.FC<MovieAddProps> = ({ setLoginIn }) => {
  const { addMovie, selectedTitle, selectedPoster, setSelectedTitle } = useMovie();
  const [genre, setGenre] = useState("");
  const [type, setType] = useState("film");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Tworzenie nowego obiektu filmu
    const newMovie = {
      id: Date.now(),
      title: selectedTitle,
      type: type,
      genre: genre,
      rating: 0,
      comments: [],
      image: `https://image.tmdb.org/t/p/w500${selectedPoster || ""}`,
    };
    // console.log("Dodano nowy film:", newMovie);
    addMovie(newMovie as MovieData);
    setSelectedTitle("");
    setGenre("");
    setLoginIn(false);
  };

  return (
    <div className={styles.movieAdd}>
      <h2>Dodaj film</h2>
      <MovieSearch />
      <form className={styles.movieAddForm} onSubmit={handleSubmit}>
        <div className="title_section">
          <label htmlFor="title">Tytuł</label>
          <input type="text" id="title" value={selectedTitle} onChange={(e) => setSelectedTitle(e.target.value)} />
        </div>
        <div className="type_section">
          <label htmlFor="type">Typ</label>
          <select name="type" id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Film">Film</option>
            <option value="Serial">Serial</option>
          </select>
        </div>
        <div className="genre_section">
          <label htmlFor="genre">Gatunek</label>
          <input type="text" id="genre" maxLength={30} value={genre} onChange={(e) => setGenre(e.target.value)} />
        </div>
        <div className="poster_section">
          <label id="poster">Plakat</label>
          <input className="poster_checkbox" type="checkbox" checked={selectedPoster ? true : false} readOnly />
        </div>

        <button type="submit">Dodaj film</button>
      </form>
    </div>
  );
};

export default MovieAdd;
