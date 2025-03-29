"use client";
import { useContext, useEffect, useMemo, useRef } from "react";
import MovieSearch from "@/app/api/MovieSearch";
import styles from "./MovieAdd.module.css";
import { MovieData } from "@/types/types";
import { MovieContext } from "@/context/MovieContext";
import { useEditMode } from "@/context/EditMovieContext";
import { v4 as uuidv4 } from "uuid";
import { FieldValues, Path, useForm, UseFormRegister } from "react-hook-form";

// Define the props for the MovieAdd component
interface MovieAddProps {
  movieDB?: MovieData[]; // Optional array of movies
  setMovieDB?: (value: MovieData[]) => void; // Optional function to set the movie database
}

// Define the structure of the form inputs
interface MovieFormInputs {
  title: string;
  type: "Film" | "Serial";
  genre: string;
  image: string;
  link: string;
  id: number;
  media_type: string;
  release_date?: string;
  overview?: string;
  backdrop_path?: string;
  vote_average?: number;
  vote_count?: number;
}

// Main component for adding a new movie
const MovieAdd: React.FC<MovieAddProps> = () => {
  const movieAddRef = useRef<HTMLDivElement>(null); // Reference to the movie add form
  const movieContext = useContext(MovieContext); // Access the movie context
  const { toggleShowAddMovie } = useEditMode(); // Get the function to toggle the add movie form visibility
  const { addMovie, selectedTitle, selectedPoster, movieLink, setSelectedTitle, setSelectedPoster } = movieContext || {}; // Destructure necessary values from context
  const movieId = useMemo(() => uuidv4().slice(0, 3), []); // Generate a unique movie ID

  // Initialize the form with default values
  const { register, handleSubmit, reset } = useForm<MovieFormInputs>({
    defaultValues: {
      title: selectedTitle || "",
      type: "Film",
      genre: "",
      image: "",
      link: "",
    },
  });

  // Function to handle form submission
  const onSubmit = async (data: MovieFormInputs) => {
    const newMovie = createMovie(data);
    await saveMovie(newMovie);
  };

  // Function to create a movie object
  const createMovie = (data: MovieFormInputs) => ({
    order: 0,
    id: movieId,
    title: data.title,
    type: data.type,
    genre: data.genre,
    ratings: {},
    comments: {},
    image: `https://image.tmdb.org/t/p/w500${selectedPoster || ""}`,
    link: movieLink || "",
    // media_type: string;
    // release_date?: string;
    // overview?: string;
    // backdrop_path?: string;
    // vote_average?: number;
    // vote_count?: number;
  });

  // Function to save the new movie to the server
  const saveMovie = async (newMovie: MovieData) => {
    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovie),
      });

      if (response.ok) {
        // Check if the response is successful
        addMovie?.(newMovie); // Add the new movie to the context
        setSelectedTitle?.(""); // Clear the selected title
        toggleShowAddMovie(); // Hide the add movie form
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to clear the movie form
  const clearMovieForm = () => {
    reset({ title: "", genre: "", type: "Film" }); // Reset form fields to default values
    setSelectedPoster?.(""); // Clear the selected poster
    setSelectedTitle?.(""); // Clear the selected title
  };

  useEffect(() => {
    if (selectedTitle) {
      reset({ title: selectedTitle }); // Reset title if selectedTitle is available
    }

    // Function to handle clicks outside the movie add form
    const handleClickOutside = (event: MouseEvent) => {
      const targetElement = event.target as HTMLElement; // Get the clicked element
      if (movieAddRef.current && !movieAddRef.current.contains(targetElement) && !targetElement.closest(`.${styles.movieAdd}`)) {
        toggleShowAddMovie(); // Hide the add movie form if clicked outside
      }
    };

    // Add event listener for mouse down events
    const clickOutsideListener = () => document.addEventListener("mousedown", handleClickOutside, { capture: true });
    setTimeout(clickOutsideListener, 100);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, { capture: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTitle, toggleShowAddMovie]);

  // Interface for the properties of the InputField component
  interface InputFieldProps<T extends FieldValues> {
    id: Path<T>; // The id of the input field
    label: string; // The label to display for the input field
    register: UseFormRegister<T>; // The register function from react-hook-form to connect the input
    required?: boolean;
    maxLength?: number;
    defaultValue?: string;
  }

  // InputField component for rendering a labeled input field
  const InputField = <T extends FieldValues>({ id, label, register, required, maxLength, defaultValue }: InputFieldProps<T>) => {
    return (
      <div>
        <label>
          {label} <br />
          {/* Register the input field with react-hook-form and set its properties */}
          <input {...register(id, { required, maxLength })} defaultValue={defaultValue} />
        </label>
      </div>
    );
  };

  // Interface for the properties of the SelectField component
  interface SelectFieldProps<T extends FieldValues> {
    id: Path<T>; // The id of the select field
    label: string;
    register: UseFormRegister<T>; // The register function from react-hook-form to connect the select
    options: string[]; // Array of options to display in the select dropdown
  }

  // SelectField component for rendering a labeled select dropdown
  const SelectField = <T extends FieldValues>({ id, label, register, options }: SelectFieldProps<T>) => (
    <div>
      <label>
        {label} <br />
        {/* Register the select field with react-hook-form */}
        <select id={id} {...register(id)}>
          {/* Map through options to create option elements */}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  // Component for rendering checkbox fields
  const CheckboxField = ({ label, checked }: { label: string; checked: boolean }) => (
    <div>
      <label>
        {label}
        <input className={styles.poster_checkbox} type="checkbox" checked={checked} readOnly />
      </label>
    </div>
  );

  // Render the MovieAdd component
  return (
    <div className={styles.movieAdd} ref={movieAddRef}>
      <h2>Add new movie</h2>
      <MovieSearch clearMovieForm={clearMovieForm} />
      <form className={styles.movieAddForm} onSubmit={handleSubmit(onSubmit)}>
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
