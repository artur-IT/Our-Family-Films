"use client";
import type { Metadata } from "next";
import { MovieProvider } from "@/context/MovieContext";
import { EditModeProvider } from "@/context/EditMovieContext";
import { Footer } from "@/layouts/Footer/Footer";
import { Main } from "@/layouts/Main/Main";
import { Shelf } from "@/components/Shelf/Shelf";
import { Header } from "@/layouts/Header/Header";
import { LoginProvider } from "@/context/LoginStateContext";
import style from "./layout.module.css";

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

// tutaj renderujemy stałe elementy strony, które będą widoczne na każdej stronie
// i nie będę sie renderować ponownie (np. header i footer)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" id="root">
      <body className={style.main}>
        {/* {children} */}
        <LoginProvider>
          <MovieProvider>
            <EditModeProvider>
              <Header />
              {children}
              <Main>
                <Shelf />
              </Main>
              <Footer />
            </EditModeProvider>
          </MovieProvider>
        </LoginProvider>
      </body>
    </html>
  );
}
