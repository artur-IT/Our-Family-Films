import { Movie } from "@/components/Movie/Movie";
import style from "./Shelf.module.css";
import { useRef } from "react";
import { useContext } from "react";
import { MovieContext } from "@/context/MovieContext";

export const Shelf = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { movies } = useContext(MovieContext) || { movies: [] }; // Uzyskaj filmy z kontekstu

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const container = containerRef.current;
      // const scrollAmount = 1000;
      const scrollAmount = container.clientWidth / 2;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className={style.shelf}>
        <button className={`${style.scroll_button} ${style.scroll_left}`} onClick={() => scroll("left")}>
          ←
        </button>

        <div className={style.shelf_movie_container} ref={containerRef}>
          {movies.map((movie) => (
            <Movie key={movie.id} movie={movie} />
          ))}
        </div>

        <button className={`${style.scroll_button} ${style.scroll_right}`} onClick={() => scroll("right")}>
          →
        </button>
      </div>
      <div className={style.shelf_bottom}></div>
      <div className={style.year}>2024</div>
    </>
  );
};
