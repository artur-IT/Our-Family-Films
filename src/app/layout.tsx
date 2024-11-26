"use client";
// import type { Metadata } from "next";
import { MovieProvider } from "@/context/MovieContext";
import styles from "./layout.module.css";
import { EditModeProvider } from "@/context/EditMovieContext";
import { Footer } from "@/layouts/Footer/Footer";
import { Main } from "@/layouts/Main/Main";
import { Shelf } from "@/components/Shelf/Shelf";
import { useState } from "react";
import { Header } from "@/layouts/Header/Header";
import MovieAdd from "@/components/MovieAdd/MovieAdd";
import { Movie } from "@/components/Movie/Movie";
import { MovieEdit } from "@/app/movies/MovieEdit/MovieEdit";

// export const metadata: Metadata = {
//   title: "Our Family Films",
//   description: "Nasze rodzinne filmy",
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [addMovie, setAddMovie] = useState<boolean>(false);

  return (
    <html lang="pl">
      <body className={styles.main}>
        <MovieProvider>
          <EditModeProvider>
            <Header isLoggedIn={isLoggedIn} setLogin={() => setIsLoggedIn(!isLoggedIn)} setAddMovie={() => setAddMovie(!addMovie)} />
            <Main>
              <Shelf isLoggedIn={isLoggedIn} />
              {/* {children} */}
              {addMovie && <MovieAdd setAddMovie={setAddMovie} />}
            </Main>
            <Footer />
          </EditModeProvider>
        </MovieProvider>
      </body>
    </html>
  );
}
