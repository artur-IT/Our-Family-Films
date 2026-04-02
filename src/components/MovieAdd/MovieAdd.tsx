"use client";
import { useContext, useEffect, useMemo, useRef } from "react";
import MovieSearch from "@/app/api/MovieSearch";
import styles from "./MovieAdd.module.css";
import { MovieData } from "@/types/types";
import { MovieContext } from "@/context/MovieContext";
import { useEditMode } from "@/context/EditMovieContext";
import { v4 as uuidv4 } from "uuid";
import { FieldValues, Path, useForm, UseFormRegister } from "react-hook-form";

interface MovieAddProps {
  movieDB?: MovieData[]; 
  setMovieDB?: (value: MovieData[]) => void;
}

const MovieAdd: React.FC<MovieAddProps> = () => {
  const movieAddRef = useRef<HTMLDivElement>(null);
  const movieContext = useContext(MovieContext);
  const { toggleShowAddMovie } = useEditMode();
  const { addMovie, selectedTitle, selectedPoster, movieLink, movieInfo, setSelectedTitle, setSelectedPoster } = movieContext || {};
  const movieId = useMemo(() => uuidv4().slice(0, 3), []); 

  const { register, handleSubmit, reset } = useForm<MovieData>({
    defaultValues: {
      title: selectedTitle || "",
      type: "Film",
      genre: "",
    },
  });

  const selectedMovie = movieInfo && movieInfo.length > 0 ? movieInfo[0] : undefined;

  const createMovie = async (data: MovieData) => {
    const newMovie: MovieData = {
      order: 0,
      id: movieId,
      title: data.title || selectedTitle || "",
      type: data.type,
      genre: data.genre,
      ratings: {},
      comments: {},
      info: {
        image: `https://image.tmdb.org/t/p/w500${selectedPoster}`,
        link: movieLink || "",
        media_type: selectedMovie?.info?.media_type || "",
        release_date: selectedMovie?.info?.release_date || "",
        overview: selectedMovie?.info?.overview || "",
        backdrop_path: selectedMovie?.info?.backdrop_path || "",
        vote_average: selectedMovie?.info?.vote_average || 0,
        vote_count: selectedMovie?.info?.vote_count || 0,
      },
    };
    await saveMovie(newMovie);
  };

  const saveMovie = async (newMovie: MovieData) => {
    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovie),
      });

      if (response.ok) {
        addMovie?.(newMovie);
        setSelectedTitle?.("");
        toggleShowAddMovie();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearMovieForm = () => {
    reset({ title: "", genre: "", type: "Film" });
    setSelectedPoster?.("");
    setSelectedTitle?.("");
  };

  useEffect(() => {
    if (selectedTitle) {
      reset({ title: selectedTitle });
    }

    const handleClickOutside = (event: MouseEvent) => {
      const targetElement = event.target as HTMLElement; 
      if (movieAddRef.current && !movieAddRef.current.contains(targetElement) && !targetElement.closest(`.${styles.movieAdd}`)) {
        toggleShowAddMovie(); 
      }
    };

    const clickOutsideListener = () => document.addEventListener("mousedown", handleClickOutside, { capture: true });
    setTimeout(clickOutsideListener, 100);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, { capture: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTitle, toggleShowAddMovie]);

  interface InputFieldProps<T extends FieldValues> {
    id: Path<T>;
    label: string; 
    register: UseFormRegister<T>;
    required?: boolean;
    maxLength?: number;
    defaultValue?: string;
  }

  const InputField = <T extends FieldValues>({ id, label, register, required, maxLength, defaultValue }: InputFieldProps<T>) => {
    return (
      <div>
        <label>
          {label} <br />
          <input {...register(id, { required, maxLength })} defaultValue={defaultValue} />
        </label>
      </div>
    );
  };

  interface SelectFieldProps<T extends FieldValues> {
    id: Path<T>; 
    label: string;
    register: UseFormRegister<T>;
    options: string[]; 
  }

  // SelectField component for rendering a labeled select dropdown
  const SelectField = <T extends FieldValues>({ id, label, register, options }: SelectFieldProps<T>) => (
    <div>
      <label>
        {label} <br />
        <select id={id} {...register(id)}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  const CheckboxField = ({ label, checked }: { label: string; checked: boolean }) => (
    <div>
      <label>
        {label}
        <input className={styles.poster_checkbox} type="checkbox" checked={checked} readOnly />
      </label>
    </div>
  );

  return (
    <div className={styles.movieAdd} ref={movieAddRef}>
      <h2>Add new movie</h2>
      <MovieSearch clearMovieForm={clearMovieForm} />
      <form className={styles.movieAddForm} onSubmit={handleSubmit(createMovie)}>
        <InputField id="title" label="Title" register={register} required maxLength={50} defaultValue={selectedTitle} />
        <InputField id="genre" label="Species" register={register} required maxLength={30} />
        <SelectField id="type" label="Type" register={register} options={["Film", "Serial"]} />
        <CheckboxField label="Poster" checked={!!selectedPoster} />
        <div className={styles.button_section}>
          <button type="submit">Add</button>
          <button type="button" onClick={toggleShowAddMovie}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovieAdd;
