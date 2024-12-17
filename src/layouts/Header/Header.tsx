"use client";
import { usePathname } from "next/navigation";
import { useEditMode } from "@/context/EditMovieContext";
import style from "./Header.module.css";
import Link from "next/link";
import { useState } from "react";

interface PropsTypes {
  isLoggedIn: boolean;
  setAddMovie: () => void;
}

export const Header = ({ isLoggedIn, setAddMovie }: PropsTypes) => {
  const { isEditMode, toggleEditMode } = useEditMode();
  const [showPanelLogin, setShowPanelLoginm] = useState<boolean>(false);
  const pathname = usePathname();

  return (
    <>
      <header className={style.header}>
        <nav>
          <p>Our Family Films</p>

          {pathname === "/admin" && (
            <>
              <button onClick={setAddMovie}>Dodaj film</button>
              <button onClick={toggleEditMode}>{isEditMode ? "Zakończ edycję" : "Edytuj filmy"}</button>
            </>
          )}

          <Link href={showPanelLogin ? "/" : "/auth"} onClick={() => setShowPanelLoginm(!showPanelLogin)}>
            {isLoggedIn ? "Wyloguj" : "Zaloguj"}
          </Link>
        </nav>
      </header>
    </>
  );
};
