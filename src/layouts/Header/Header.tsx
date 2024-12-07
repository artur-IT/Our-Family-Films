"use client";
import { useEditMode } from "@/context/EditMovieContext";
import { useRouter } from "next/navigation";
import style from "./Header.module.css";
import Link from "next/link";

interface PropsTypes {
  isLoggedIn: boolean;
  setLogin: () => void;
  setAddMovie: () => void;
}

export const Header = ({ isLoggedIn, setLogin, setAddMovie }: PropsTypes) => {
  const { isEditMode, toggleEditMode } = useEditMode();
  const router = useRouter();

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
          <Link onClick={() => setLogin()} replace href="/auth">
            {isLoggedIn ? "Wyloguj" : "Zaloguj"}{" "}
          </Link>
          {/* <a href="#" onClick={setLogin}>
            {isLoggedIn ? "Wyloguj" : "Zaloguj"}
          </a> */}
        </nav>
      </header>
      {/* {isLoggedIn && <PanelLogin />} */}
    </>
  );
};
