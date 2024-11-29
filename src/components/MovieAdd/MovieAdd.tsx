"use client";
import { useContext, useEffect, useMemo } from "react";
import MovieSearch from "@/app/api/MovieSearch";
import styles from "./MovieAdd.module.css";
import { MovieData } from "@/types/types";
import { MovieContext } from "@/context/MovieContext";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";

interface MovieAddProps {
  movieDB?: MovieData[];
  setMovieDB?: (value: MovieData[]) => void;
  setAddMovie: (value: boolean) => void;
}
interface MovieFormInputs {
  title: string;
  type: "Film" | "Serial";
  genre: string;
  image: string;
}

const MovieAdd: React.FC<MovieAddProps> = ({ setAddMovie }) => {
  const movieContext = useContext(MovieContext);
  const { addMovie, selectedTitle, selectedPoster, setSelectedTitle } = movieContext || {};
  const movieId = useMemo(() => uuidv4().slice(0, 3), []);

  const { register, handleSubmit, reset } = useForm<MovieFormInputs>({
    defaultValues: {
      title: selectedTitle || "",
      type: "Film",
      genre: "",
      image: "",
    },
  });

  const onSubmit = async (data: MovieFormInputs) => {
    const newMovie = {
      id: movieId,
      title: data.title,
      type: data.type,
      genre: data.genre,
      rating: 0,
      comments: {},
      image: `https://image.tmdb.org/t/p/w500${selectedPoster || ""}`,
    };

    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovie),
      });

      if (response.ok) {
        if (addMovie) {
          addMovie(newMovie as MovieData);
        }
        if (setSelectedTitle) {
          setSelectedTitle("");
        }

        setAddMovie(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedTitle) {
      reset({
        title: selectedTitle,
        type: "Film",
        genre: "",
        image: "",
      });
    }
  }, [selectedTitle]);

  return (
    <div className={styles.movieAdd}>
      <h2>Dodaj film</h2>
      <MovieSearch />
      <form className={styles.movieAddForm} onSubmit={handleSubmit(onSubmit)}>
        <div className="title_section">
          <label htmlFor="title">Tytuł</label>
          <input id="title" {...register("title")} defaultValue={selectedTitle || ""} />
        </div>
        <div className="type_section">
          <label htmlFor="type">Typ</label>
          <select id="type" {...register("type")}>
            <option value="Film">Film</option>
            <option value="Serial">Serial</option>
          </select>
        </div>
        <div className="genre_section">
          <label htmlFor="genre">Gatunek</label>
          <input id="genre" maxLength={30} {...register("genre", { required: "Wybierz gatunek", maxLength: 30 })} />
        </div>
        <div className="poster_section">
          <label id="poster">
            Plakat
            <input className="poster_checkbox" type="checkbox" name="poster" checked={selectedPoster ? true : false} readOnly />
          </label>
        </div>

        <button type="submit">Dodaj film</button>
        <button type="submit" onClick={() => setAddMovie(false)}>
          Anuluj
        </button>
      </form>
    </div>
  );
};

export default MovieAdd;
