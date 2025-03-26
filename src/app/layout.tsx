import type { Metadata } from "next";
import { MovieProvider } from "@/context/MovieContext";
import { EditModeProvider } from "@/context/EditMovieContext";
import { Footer } from "@/layouts/Footer/Footer";
import { Main } from "@/layouts/Main/Main";
import { Shelf } from "@/components/Shelf/Shelf";
import { Header } from "@/layouts/Header/Header";
import { LoginProvider } from "@/context/LoginStateContext";
import style from "./layout.module.css";
import "./globals.css";
import { Hero } from "@/components/Hero/Hero";

export const metadata: Metadata = {
  title: "Our Family Films",
  description: "Nasze rodzinne filmy",
  icons: {
    apple: "/apple-touch-icon.png",
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
};

// here we render the static elements of the page that will be visible on every page
// and will not be re-rendered (e.g. header and footer)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html lang="en" id="root">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap" rel="stylesheet" />

          <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet" type="text/css"></link>
        </head>
        <body className={style.main}>
          <LoginProvider>
            <MovieProvider>
              <EditModeProvider>
                <div className={style.wrap}>
                  <Header panelLogin={children} />
                  <Hero />
                  <Main>
                    <Shelf />
                  </Main>
                  <Footer />
                </div>
              </EditModeProvider>
            </MovieProvider>
          </LoginProvider>

          <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>
          <div id="title">
            <span>PURE CSS</span>
            <br />
            <span>PARALLAX PIXEL STARS</span>
          </div>
        </body>
      </html>
    </>
  );
}
