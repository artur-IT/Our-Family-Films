import { useContext } from "react";
import styles from "./MovieEdit.module.css";
import { useForm } from "react-hook-form";
import { MovieContext } from "@/context/MovieContext";
import { useEditMode } from "@/context/EditMovieContext";

interface MovieFormInputs {
  id?: string;
  title: string;
  type: string;
  ratings: number | any;
  genre: string;
  comment?: string;
  comments?: Record<string, string>;
}

interface MovieEditProps {
  setEditForm: (value: boolean) => void;
  movie: MovieFormInputs;
  id: string;
}

export const MovieEdit = ({ setEditForm, movie, id }: MovieEditProps) => {
  const { user } = useEditMode();
  {
    const movieContext = useContext(MovieContext);
    const { register, handleSubmit } = useForm<MovieFormInputs>({
      defaultValues: {
        title: movie.title,
        type: movie.type,
        genre: movie.genre,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ratings: movie.ratings?.[user] || 0,
        comment: movie.comments?.[user] || "",
        comments: {},
      },
    });

    const handleSave = handleSubmit(async (data) => {
      const newData = {
        id: id,
        title: data.title,
        type: data.type,
        genre: data.genre,
      };
      try {
        const updatedComments = {
          ...movie.comments, // zachowujemy wszystkie istniejące komentarze
          [user]: data.comment, // dodajemy/aktualizujemy komentarz aktualnego użytkownika
        };

        const updatedRatings = {
          ...movie.ratings,
          [user]: Number(data.ratings),
        };

        await movieContext?.updateMovie(id, {
          ...newData,
          ratings: updatedRatings,
          comments: updatedComments,
        });
        setEditForm(false);
      } catch (error) {
        console.error("Błąd podczas aktualizacji filmu:", error);
      }
    });

    const handleCancel = () => setEditForm(false);

    return (
      <>
        <div className={styles.movieEdit} style={user ? { opacity: 1 } : undefined}>
          {user === "Artur" && (
            <>
              <div>
                <label>
                  Title
                  <input id="title" {...register("title")} />
                </label>
              </div>

              <div>
                <label>
                  Species
                  <input id="genre" maxLength={30} {...register("genre", { maxLength: 30 })} />
                </label>
              </div>

              <div>
                <label>
                  Type
                  <br />
                  <select maxLength={30} {...register("type")}>
                    <option value="Film">Film</option>
                    <option value="Serial">Serial</option>
                  </select>
                </label>
              </div>
            </>
          )}

          <div>
            <label>
              Rating
              <br />
              <select {...register("ratings")}>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </label>
          </div>

          <div>
            <label>
              Comment
              <input type="text" placeholder="change comment" maxLength={30} {...register("comment", { maxLength: 30 })} />
            </label>
          </div>

          <div className={styles.movie_actions}>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </>
    );
  }
};
