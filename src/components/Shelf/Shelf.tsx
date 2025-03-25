"use client";
import { Movie } from "@/components/Movie/Movie";
import style from "./Shelf.module.css";
import { useRef, useContext } from "react";
import { MovieContext } from "@/context/MovieContext";
import { useLoginState } from "@/context/LoginStateContext";
import { MovieData } from "@/types/types";

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableMovie } from "@/components/SortableMovie/SortableMovie";
import { EditModeContext } from "@/context/EditMovieContext";

export const Shelf = () => {
  // Create a reference to the container element for scrolling
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useLoginState();

  // Get the edit context and user information
  const { isEditMode, user } = useContext(EditModeContext) || { isEditMode: false, user: "" };

  // Use the MovieContext to get the list of movies, defaulting to an empty array if not available
  const { movies, updateDragDropMovie } = useContext(MovieContext) || { movies: [] };

  const handleScroll = (direction: "left" | "right") => {
    // Scroll the container by its width in the specified direction
    containerRef.current?.scrollBy({
      left: direction === "left" ? -containerRef.current.clientWidth : containerRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  // Configuration of sensors for dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = movies.findIndex((movie) => movie.id === active.id);
      const newIndex = movies.findIndex((movie) => movie.id === over.id);

      // Create a new array with the moved movie
      const newMovies = arrayMove(movies, oldIndex, newIndex);
      console.log(newMovies);
      if (updateDragDropMovie) {
        // Update local state
        updateDragDropMovie(newMovies);
      }
    }
  };

  return (
    <>
      <div className={style.shelf}>
        <button className={`${style.scroll_button} ${style.scroll_left}`} onClick={() => handleScroll("left")}>
          ←
        </button>

        {/* Container for movie components */}
        <div className={style.shelf_movie_container} ref={containerRef}>
          {user === "Artur" && !isEditMode && isLoggedIn ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={movies.map((movie) => movie.id)} strategy={horizontalListSortingStrategy}>
                {movies.map((movie) => (
                  <SortableMovie key={movie.id} movie={movie} isLoggedIn={isLoggedIn} id={movie.id} />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            // Standard view for users who are not administrators
            movies.map((movie) => <Movie isLoggedIn={isLoggedIn} key={movie.id} movie={movie} />)
          )}
        </div>

        <button className={`${style.scroll_button} ${style.scroll_right}`} onClick={() => handleScroll("right")}>
          →
        </button>
      </div>
      <div className={style.shelf_bottom}>
        <div className={style.description}>
          Znajdziesz tu rekomendacje filmów odpowiednich dla całej rodziny – bez przemocy, wulgarnego języka, scen niemoralnych,
          kontrowersyjnych treści czy treści podważających podstawowe zasady etyczne. Filmy, które obejrzeliśmy razem z naszymi nastoletnimi
          dziećmi. Jest w nich wyraźnie zarysowane dobro i zło, promowane są wartości chrześcijańskie m.in. rodzina, przyjaźń, miłość,
          nadzieja, pomoc słabszym i potrzebującym, poświęcenie, szacunek dla innych. To filmy, które inspirują, podnoszą na duchu i
          wzmacniają więzi rodzinne.
        </div>
      </div>
    </>
  );
};
