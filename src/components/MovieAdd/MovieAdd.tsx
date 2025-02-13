"use client";
import { useContext, useEffect, useMemo, useRef } from "react";
import MovieSearch from "@/app/api/MovieSearch";
import styles from "./MovieAdd.module.css";
import { MovieData } from "@/types/types";
import { MovieContext } from "@/context/MovieContext";
import { useEditMode } from "@/context/EditMovieContext";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";

interface MovieAddProps {
  movieDB?: MovieData[];
  setMovieDB?: (value: MovieData[]) => void;
}
interface MovieFormInputs {
  title: string;
  type: "Film" | "Serial";
  genre: string;
  image: string;
}

const MovieAdd: React.FC<MovieAddProps> = () => {
  const movieAddRef = useRef<HTMLDivElement>(null);
  const movieContext = useContext(MovieContext);
  const { toggleShowAddMovie } = useEditMode();
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
      ratings: {},
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

        toggleShowAddMovie();
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

    const handleClickOutside = (event: MouseEvent) => {
      const targetElement = event.target as HTMLElement;
      if (movieAddRef.current && !movieAddRef.current.contains(targetElement) && !targetElement.closest(`.${styles.movieAdd}`)) {
        toggleShowAddMovie();
      }
    };

    setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside, { capture: true });
    }, 100);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, { capture: true });
    };
  }, [selectedTitle, toggleShowAddMovie]);

  return (
    <div className={styles.movieAdd} ref={movieAddRef}>
      <h2>Dodaj film</h2>
      <MovieSearch />
      <form className={styles.movieAddForm} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>
            Tytuł <br />
            <input id="title" {...register("title")} defaultValue={selectedTitle || ""} />
          </label>
        </div>

        <div>
          <label>
            Gatunek <br />
            <input id="genre" maxLength={30} {...register("genre", { required: "Wybierz gatunek", maxLength: 30 })} />
          </label>
        </div>
        <div>
          <label>
            Typ <br />
            <select id="type" {...register("type")}>
              <option value="Film">Film</option>
              <option value="Serial">Serial</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Plakat
            <input className={styles.poster_checkbox} type="checkbox" name="poster" checked={selectedPoster ? true : false} readOnly />
          </label>
        </div>

        <div className={styles.button_section}>
          <button type="submit">Dodaj </button>
          <button type="submit" onClick={() => toggleShowAddMovie()}>
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovieAdd;
