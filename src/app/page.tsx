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

  return (
    <>
      <Header onLogin={() => setIsLoggedIn(!isLoggedIn)} />
      <Main>
        <Shelf />
        {/* {isLoggedIn && <PanelLogin />} */}
        {isLoggedIn && <MovieAdd setLoginIn={setIsLoggedIn} />}
      </Main>
      <Footer />
    </>
  );
}
