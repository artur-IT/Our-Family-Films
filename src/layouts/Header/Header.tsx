"use client";
import { useEditMode } from "@/context/EditMovieContext";
import { createPortal } from "react-dom";
import style from "./Header.module.css";
import Link from "next/link";
import { useState } from "react";
import { PanelLogin } from "../PanelLogin/PanelLogin";

interface PropsTypes {
  isLoggedIn: boolean;
  setLogin: () => void;
  setAddMovie: () => void;
}

export const Header = ({ isLoggedIn, setLogin, setAddMovie }: PropsTypes) => {
  const { isEditMode, toggleEditMode } = useEditMode();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <header className={style.header}>
        <nav>
          <p>Our Family Films</p>
          {isLoggedIn && (
            <>
              <button onClick={setAddMovie}>Dodaj film</button>
              <button onClick={toggleEditMode}>{isEditMode ? "Zakończ edycję" : "Edytuj filmy"}</button>
            </>
          )}
          <Link href="/admin">Panel Admina</Link>
          <Link href="/auth">Panel Logowania</Link>
          <button onClick={() => setShowLogin(!showLogin)}>{isLoggedIn ? "Wyloguj" : "Zaloguj"}</button>
        </nav>
      </header>
      <div id="modal-root"></div>
      {/* {showLogin && createPortal(<PanelLogin />, document.getElementById("modal-root")!)} */}
    </>
  );
};
