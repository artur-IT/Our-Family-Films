import { useContext, useState } from "react";
import styles from "./MovieEdit.module.css";
import { useForm } from "react-hook-form";
import { MovieContext } from "@/context/MovieContext";

interface MovieFormInputs {
  id?: string;
  title: string;
  type: string;
  rating: number;
  genre: string;
}

interface MovieEditProps {
  setEditForm: (value: boolean) => void;
  movie: MovieFormInputs;
  id: string;
}

export const MovieEdit = ({ setEditForm, movie, id }: MovieEditProps) => {
  {
    const [isEditing, setIsEditing] = useState(false);
    const movieContext = useContext(MovieContext);
    const { register, handleSubmit } = useForm<MovieFormInputs>({
      defaultValues: {
        title: movie.title,
        type: movie.type,
        genre: movie.genre,
        rating: movie.rating,
      },
    });

    const handleSave = handleSubmit(async (data) => {
      const newData = {
        id: id,
        title: data.title,
        type: data.type,
        genre: data.genre,
        rating: Number(data.rating),
      };
      try {
        await movieContext?.updateMovie(id, {
          ...newData,
          rating: newData.rating as 0 | 2 | 1 | 3 | undefined,
        });
        setIsEditing(false);
        setEditForm(false);
      } catch (error) {
        console.error("Błąd podczas aktualizacji filmu:", error);
      }
    });

    const handleCancel = () => {
      setIsEditing(true);
      setEditForm(false);
    };

    return (
      <>
        <div className={styles.movieEdit}>
          {!isEditing && (
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
        </div>
      </>
    );
  }
};
