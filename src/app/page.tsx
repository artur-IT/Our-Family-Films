"use client";
import { Header } from "@/layouts/Header/Header";
import { Main } from "@/layouts/Main/Main";
import { Shelf } from "@/components/Shelf/Shelf";
import { Footer } from "@/layouts/Footer/Footer";

import { useState } from "react";
// import { PanelLogin } from "./layouts/PanelLogin/PanelLogin";
import MovieAdd from "@/components/MovieAdd/MovieAdd";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [addMovie, setAddMovie] = useState<boolean>(false);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setLogin={() => setIsLoggedIn(!isLoggedIn)} setAddMovie={() => setAddMovie(!addMovie)} />
      <Main>
        <Shelf />
        {/* {isLoggedIn && <PanelLogin />} */}
        {addMovie && <MovieAdd setAddMovie={setAddMovie} />}
      </Main>
      <Footer />
    </>
  );
}
