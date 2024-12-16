"use client";
import { usePathname } from "next/navigation";
import { useEditMode } from "@/context/EditMovieContext";
import style from "./Header.module.css";
import Link from "next/link";

interface PropsTypes {
  isLoggedIn: boolean;
  setLogin: () => void;
  setAddMovie: () => void;
}

export const Header = ({ isLoggedIn, setLogin, setAddMovie }: PropsTypes) => {
  const { isEditMode, toggleEditMode } = useEditMode();
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

          <Link href={isLoggedIn ? "/" : "/auth"} onClick={setLogin}>
            {isLoggedIn ? "Wyloguj" : "Zaloguj"}
          </Link>
        </nav>
      </header>
    </>
  );
};
