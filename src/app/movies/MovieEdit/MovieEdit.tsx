import { useEditMode } from "@/context/EditMovieContext";
import style from "./MovieEdit.module.css";

type MovieCardProps = {
  movie: {
    id: string;
    title: string;
    description: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export const MovieEdit = () => {
  const { isEditMode } = useEditMode();

  return (
    <>
      {isEditMode && (
        <div className={style.movie_description}>
          <button className={style.edit_btn}>Edytuj</button>
          <button className={style.delete_btn}>Usuń</button>
        </div>
      )}
    </>
  );
};
