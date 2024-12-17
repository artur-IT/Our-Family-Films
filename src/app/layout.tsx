"use client";
import type { Metadata } from "next";
import { MovieProvider } from "@/context/MovieContext";
import { EditModeProvider } from "@/context/EditMovieContext";
import { Footer } from "@/layouts/Footer/Footer";
import { Main } from "@/layouts/Main/Main";
import { Shelf } from "@/components/Shelf/Shelf";
import MovieAdd from "@/components/MovieAdd/MovieAdd";
import { Header } from "@/layouts/Header/Header";
import { useState } from "react";
import { LoginProvider } from "@/context/LoginStateContext";

// export const metadata: Metadata = {
//   title: "Our Family Films",
//   description: "Nasze rodzinne filmy",
//   icons: {
//     apple: "/apple-touch-icon.png",
//     icon: [
//       { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
//       { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
//     ],
//     other: [
//       {
//         rel: "manifest",
//         url: "/site.webmanifest",
//       },
//     ],
//   },
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [showAddMovie, setShowAddMovie] = useState<boolean>(false);

  return (
    <html lang="pl">
      <body>
        <LoginProvider>
          <MovieProvider>
            <EditModeProvider>
              <Header setShowAddMovie={() => setShowAddMovie(!showAddMovie)} />

              {children}
              <Main>
                <Shelf />
                {showAddMovie && <MovieAdd setShowAddMovie={setShowAddMovie} />}
              </Main>
              <Footer />
            </EditModeProvider>
          </MovieProvider>
        </LoginProvider>
      </body>
    </html>
  );
}
