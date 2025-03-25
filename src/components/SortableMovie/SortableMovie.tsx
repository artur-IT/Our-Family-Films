import styles from "./SortableMovie.module.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Movie } from "@/components/Movie/Movie";
import { MovieData } from "@/types/types";

interface SortableMovieProps {
  movie: MovieData;
  isLoggedIn: boolean;
  id: string;
}

export const SortableMovie = ({ movie, isLoggedIn, id }: SortableMovieProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    position: "relative",
  };
  return (
    <div ref={setNodeRef} style={style as React.CSSProperties} {...attributes} {...listeners}>
      <div className={styles.drag_handle}>
        <span className={styles.drag_icon}>⋮⋮</span>
      </div>
      <Movie isLoggedIn={isLoggedIn} movie={movie} />
    </div>
  );
};
