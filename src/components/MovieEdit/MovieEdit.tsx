import { useContext } from "react";
import styles from "./MovieEdit.module.css";
import { useForm } from "react-hook-form";
import { MovieContext } from "@/context/MovieContext";
import { useEditMode } from "@/context/EditMovieContext";
import { MovieData } from "@/types/types";

interface MovieFormInputs {
  id?: string;
  title: string;
  type: string;
  ratings: number;
  genre: string;
  comment?: string;
  comments?: Record<string, string>;
}

interface MovieEditProps {
  setEditForm: (value: boolean) => void; 
  movie: MovieData;
  id: string; 
}

export const MovieEdit = ({ setEditForm, movie, id }: MovieEditProps) => {
  const { user } = useEditMode();
  const movieContext = useContext(MovieContext); 

  const { register, handleSubmit } = useForm<MovieFormInputs>({
    defaultValues: {
      title: movie.title,
      type: movie.type,
      genre: movie.genre,
      ratings: movie.ratings?.[user] || 0, 
      comment: movie.comments?.[user] || "", 
      comments: {},
    },
  });

  const handleSave = handleSubmit(async (data) => {
    const updatedData = {
      id,
      title: data.title,
      type: data.type,
      genre: data.genre,
      ratings: {
        ...movie.ratings,
        [user]: Number(data.ratings), 
      },
      comments: {
        ...movie.comments,
        ...(data.comment ? { [user]: data.comment } : {}), 
      },
    };

    try {
      await movieContext?.updateMovie(id, updatedData); 
      setEditForm(false);
    } catch (error) {
      console.error("Error while updating the movie:", error);
    }
  });

  return (
    <div className={styles.movieEdit} style={user ? { opacity: 1 } : undefined} data-testid="movie-edit">
      {user === "Artur" && (
        <>
          {(["title", "genre", "type"] as const).map((field, index) => (
            <div key={index}>
              <label>
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {field === "type" ? ( 
                  <select {...register(field)}>
                    <option value="Film">Film</option>
                    <option value="Serial">Serial</option>
                  </select>
                ) : (
                  <input id={field} maxLength={field === "genre" ? 30 : undefined} {...register(field)} /> 
                )}
              </label>
            </div>
          ))}{" "}
        </>
      )}

      {(["ratings", "comment"] as const).map((field, index) => (
        <div key={index}>
          <label>
            {field.charAt(0).toUpperCase() + field.slice(1)} 
            {field === "ratings" ? ( 
              <select {...register(field)}>
                {[0, 1, 2, 3].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            ) : (
              <input type="text" placeholder="change comment, max.30" maxLength={50} {...register(field)} />
            )}
          </label>
        </div>
      ))}

      <div className={styles.movie_actions}>
        <button onClick={handleSave}>Save</button>
        <button onClick={() => setEditForm(false)}>Cancel</button>
      </div>
    </div>
  );
};
