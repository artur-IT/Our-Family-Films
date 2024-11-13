import { Movie } from "../Movie/Movie";
import style from "./Shelf.module.css";
import { useRef } from "react";

interface MovieData {
  id: number;
  title: string;
  year: number;
  genre: string;
  rating: 1 | 2 | 3;
  comments: string[];
  image: string;
}

export const Shelf = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const movieDB: MovieData[] = [
    {
      id: 1,
      title: "Rambo",
      year: 1982,
      genre: "Action",
      rating: 1,
      comments: ["Komentarz 1", "Komentarz 2", "Komentarz 3"],
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      title: "Rambo II",
      year: 1985,
      genre: "Action",
      rating: 2,
      comments: ["Komentarz 1", "Komentarz 2"],
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      title: "Rambo III",
      year: 1988,
      genre: "Action",
      rating: 3,
      comments: ["Komentarz 1"],
      image: "https://via.placeholder.com/150",
    },
  ];

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
          {movieDB.map((movie) => (
            <Movie key={movie.id} movie={movie} isLoggedIn={isLoggedIn} />
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
