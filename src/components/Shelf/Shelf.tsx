"use client";

import { Movie } from "@/components/Movie/Movie";
import style from "./Shelf.module.css";
import { useRef } from "react";
import { useContext } from "react";
import { MovieContext } from "@/context/MovieContext";
import { useLoginState } from "@/context/LoginStateContext";

export const Shelf = () => {
  // Create a reference to the container element for scrolling
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useLoginState();
  // Use the MovieContext to get the list of movies, defaulting to an empty array if not available
  const { movies } = useContext(MovieContext) || { movies: [] };

  const handleScroll = (direction: "left" | "right") => {
    // Scroll the container by its width in the specified direction
    containerRef.current?.scrollBy({
      left: direction === "left" ? -containerRef.current.clientWidth : containerRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className={style.shelf}>
        <button className={`${style.scroll_button} ${style.scroll_left}`} onClick={() => handleScroll("left")}>
          ←
        </button>

        {/* Container for movie components */}
        <div className={style.shelf_movie_container} ref={containerRef}>
          {movies.map((movie) => (
            <Movie isLoggedIn={isLoggedIn} key={movie.id} movie={movie} />
          ))}
        </div>

        <button className={`${style.scroll_button} ${style.scroll_right}`} onClick={() => handleScroll("right")}>
          →
        </button>
      </div>
      <div className={style.shelf_bottom}>
        <div className={style.description}>
          Filmy, które obejrzeliśmy razem z naszymi dziećmi. Filmy te nie zawierają treści, które są szkodliwe dla dorastających dzieci,
          jest w nich wyraźnie zarysowane dobro i zło, promowane są wartości chrześcijańskie m.in. rodzina, przyjaźń, miłość, pomoc słabszym
          i potrzebującym, poświęcenie, szacunek dla innych.
        </div>
      </div>
    </>
  );
};
