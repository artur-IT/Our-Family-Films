import { useContext } from "react";
import styles from "./MovieEdit.module.css";
import { useForm } from "react-hook-form";
import { MovieContext } from "@/context/MovieContext";
import { useEditMode } from "@/context/EditMovieContext";

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
  setEditForm: (value: boolean) => void; // Function to toggle the edit form visibility
  movie: {
    id?: string;
    title: string;
    type: string;
    ratings: Record<string, number>;
    genre: string;
    comment?: string;
    comments?: Record<string, string>;
  };
  id: string; // ID of the movie being edited
}

// Main component for editing movie details
export const MovieEdit = ({ setEditForm, movie, id }: MovieEditProps) => {
  const { user } = useEditMode(); // Get the current user from edit mode context
  const movieContext = useContext(MovieContext); // Access movie context

  // Initialize the form with default values based on the movie data
  const { register, handleSubmit } = useForm<MovieFormInputs>({
    defaultValues: {
      title: movie.title,
      type: movie.type,
      genre: movie.genre,
      ratings: movie.ratings?.[user] || 0, // Default rating for the current user
      comment: movie.comments?.[user] || "", // Default comment for the current user
      comments: {},
    },
  });

  // Function to handle saving the updated movie data
  const handleSave = handleSubmit(async (data) => {
    const updatedData = {
      id,
      title: data.title,
      type: data.type,
      genre: data.genre,
      ratings: {
        ...movie.ratings,
        [user]: Number(data.ratings), // Update the rating for the current user
      },
      comments: {
        ...movie.comments,
        ...(data.comment ? { [user]: data.comment } : {}), // Add comment if provided
      },
    };

    try {
      await movieContext?.updateMovie(id, updatedData); // Update the movie in context
      setEditForm(false); // Close the edit form
    } catch (error) {
      console.error("Error while updating the movie:", error);
    }
  });

  return (
    <div className={styles.movieEdit} style={user ? { opacity: 1 } : undefined} data-testid="movie-edit">
      {user === "Artur" && ( // Check if the user is allowed to edit
        <>
          {(["title", "genre", "type"] as const).map((field, index) => (
            <div key={index}>
              <label>
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {field === "type" ? ( // Render a select for the type field
                  <select {...register(field)}>
                    <option value="Film">Film</option>
                    <option value="Serial">Serial</option>
                  </select>
                ) : (
                  <input id={field} maxLength={field === "genre" ? 30 : undefined} {...register(field)} /> // Render input for other fields
                )}
              </label>
            </div>
          ))}{" "}
        </>
      )}

      {(["ratings", "comment"] as const).map((field, index) => (
        <div key={index}>
          <label>
            {field.charAt(0).toUpperCase() + field.slice(1)} {/* Display the field name with the first letter capitalized  */}
            {field === "ratings" ? ( // Render a select for the ratings field
              <select {...register(field)}>
                {[0, 1, 2, 3].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            ) : (
              <input type="text" placeholder="change comment, max.30" maxLength={30} {...register(field)} />
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
