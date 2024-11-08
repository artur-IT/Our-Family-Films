import { Movie } from "../Movie/Movie";
import style from "./Shelf.module.css";
import { useRef } from "react";

export const Shelf = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 1000;
      containerRef.current.scrollBy({
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
          <Movie isLoggedIn={isLoggedIn} />
          <Movie isLoggedIn={isLoggedIn} />
          <Movie isLoggedIn={isLoggedIn} />
          <Movie isLoggedIn={isLoggedIn} />
          <Movie isLoggedIn={isLoggedIn} />
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
