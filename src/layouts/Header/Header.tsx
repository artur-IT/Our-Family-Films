"use client";
import { usePathname } from "next/navigation";
import { useEditMode } from "@/context/EditMovieContext";
import style from "./Header.module.css";
import Link from "next/link";
import { useState } from "react";
import { useLoginState } from "@/context/LoginStateContext";
import { set } from "react-hook-form";

interface PropsTypes {
  setShowAddMovie: () => void;
}

export const Header = ({ setShowAddMovie }: PropsTypes) => {
  const { isEditMode, toggleEditMode } = useEditMode();
  const [showPanelLogin, setShowPanelLogin] = useState<boolean>(false);
  const { isLoggedIn, setIsLoggedIn } = useLoginState();
  const pathname = usePathname();

  //

  const handleLinkLogin = () => {
    if (isLoggedIn) {
      setIsLoggedIn(!isLoggedIn);
    }
    setShowPanelLogin(!showPanelLogin);
  };

  return (
    <>
      <header className={style.header}>
        <nav>
          <p>Our Family Films</p>

          {pathname === "/admin" && isLoggedIn && (
            <>
              <button onClick={setShowAddMovie}>Dodaj film</button>
              <button onClick={toggleEditMode}>{isEditMode ? "Zakończ edycję" : "Edytuj filmy"}</button>
            </>
          )}

          <Link href={showPanelLogin ? "/" : "/auth"} onClick={handleLinkLogin}>
            {isLoggedIn ? "Wyloguj" : "Zaloguj"}
          </Link>
        </nav>
      </header>
    </>
  );
};
