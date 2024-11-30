"use client";
import { MovieProvider } from "@/context/MovieContext";
import styles from "./layout.module.css";
import { EditModeProvider } from "@/context/EditMovieContext";
import { Footer } from "@/layouts/Footer/Footer";
import { Main } from "@/layouts/Main/Main";
import { Shelf } from "@/components/Shelf/Shelf";
import { useState } from "react";
import { Header } from "@/layouts/Header/Header";
import MovieAdd from "@/components/MovieAdd/MovieAdd";

export default function ClientLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [addMovie, setAddMovie] = useState<boolean>(false);

  return (
    <MovieProvider>
      <EditModeProvider>
        <Header isLoggedIn={isLoggedIn} setLogin={() => setIsLoggedIn(!isLoggedIn)} setAddMovie={() => setAddMovie(!addMovie)} />
        <Main>
          <Shelf isLoggedIn={isLoggedIn} />
          {addMovie && <MovieAdd setAddMovie={setAddMovie} />}
        </Main>
        <Footer />
      </EditModeProvider>
    </MovieProvider>
  );
}
