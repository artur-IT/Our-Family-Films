import { useEditMode } from "@/context/EditMovieContext";
import { PanelLogin } from "../PanelLogin/PanelLogin";
import style from "./Header.module.css";

interface PropsTypes {
  isLoggedIn: boolean;
  setLogin: () => void;
  setAddMovie: () => void;
}

export const Header = ({ isLoggedIn, setLogin, setAddMovie }: PropsTypes) => {
  const { isEditMode, toggleEditMode } = useEditMode();

  return (
    <>
      <header className={style.header}>
        <nav>
          <p>Our Family Films</p>
          {isLoggedIn && (
            <>
              <a href="#" onClick={setAddMovie}>
                Dodaj film
              </a>
              <a href="#">Edytuj film</a>
              <button onClick={toggleEditMode}>{isEditMode ? "Zakończ edycję" : "Edytuj filmy"}</button>
            </>
          )}

          <a href="#" onClick={setLogin}>
            Zaloguj
          </a>
        </nav>
      </header>
      {/* {isLoggedIn && <PanelLogin />} */}
    </>
  );
};
