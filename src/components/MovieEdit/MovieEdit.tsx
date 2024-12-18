import { useContext, useState } from "react";
import styles from "./MovieEdit.module.css";
import { useForm } from "react-hook-form";
import { MovieContext } from "@/context/MovieContext";
import { useEditMode } from "@/context/EditMovieContext";

interface MovieFormInputs {
  id?: string;
  title: string;
  type: string;
  rating: number;
  genre: string;
  comment?: string;
}

interface MovieEditProps {
  setEditForm: (value: boolean) => void;
  movie: MovieFormInputs;
  id: string;
}

export const MovieEdit = ({ setEditForm, movie, id }: MovieEditProps) => {
  const { user } = useEditMode();
  {
    const [isEditingADMIN, setIsEditingADMIN] = useState(user);
    const [isEditingUSER, setIsEditingUSER] = useState(user);
    const movieContext = useContext(MovieContext);
    const { register, handleSubmit } = useForm<MovieFormInputs>({
      defaultValues: {
        title: movie.title,
        type: movie.type,
        genre: movie.genre,
        rating: movie.rating,
        comment: movie.comment,
      },
    });

    const handleSave = handleSubmit(async (data) => {
      const newData = {
        id: id,
        title: data.title,
        type: data.type,
        genre: data.genre,
        rating: Number(data.rating),
        comment: data.comment,
      };
      try {
        await movieContext?.updateMovie(id, {
          ...newData,
          rating: newData.rating as 0 | 2 | 1 | 3 | undefined,
          comments: newData.comment ? [newData.comment] : [],
        });
        // setIsEditingADMIN(false);
        setEditForm(false);
      } catch (error) {
        console.error("Błąd podczas aktualizacji filmu:", error);
      }
    });

    const handleCancel = () => {
      // setIsEditingADMIN(true);
      setEditForm(false);
    };

    return (
      <>
        <div className={styles.movieEdit}>
          {isEditingADMIN === "ad" && (
            <>
              <div className="title_section">
                <label htmlFor="title">Tytuł</label>
                <input id="title" {...register("title")} />
              </div>

              <div className="type_section">
                <label htmlFor="type">Typ</label>
                <select id="type" maxLength={30} {...register("type")}>
                  <option value="Film">Film</option>
                  <option value="Serial">Serial</option>
                </select>
              </div>

              <div>
                <label htmlFor="genre">Gatunek</label>
                <input id="genre" maxLength={30} {...register("genre", { maxLength: 30 })} />
              </div>

              <div className="rating">
                <label htmlFor="rating">Ocena</label>
                <select id="rating" {...register("rating")}>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>

              <div className="movie-actions">
                <button onClick={handleSave}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
              </div>
            </>
          )}

          {isEditingUSER === "us" && (
            <>
              <div className="rating">
                <label htmlFor="rating">Ocena</label>
                <select id="rating" {...register("rating")}>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>

              <div className="comment">
                <label htmlFor="comment">Komentarz</label>
                <input type="text" placeholder="Zmień komentarz" maxLength={30} {...register("comment", { maxLength: 30 })} />
              </div>

              <div className="movie-actions">
                <button onClick={handleSave}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
              </div>
            </>
          )}
        </div>
      </>
    );
  }
};
