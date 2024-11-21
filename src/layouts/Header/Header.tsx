import { PanelLogin } from "../PanelLogin/PanelLogin";
import style from "./Header.module.css";

interface PropsTypes {
  isLoggedIn: boolean;
  setLogin: () => void;
  setAddMovie: () => void;
}

export const Header = ({ isLoggedIn, setLogin, setAddMovie }: PropsTypes) => {
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
            </>
          )}

          <a href="#" onClick={setLogin}>
            Zaloguj
          </a>
        </nav>
      </header>
      {isLoggedIn && <PanelLogin />}
    </>
  );
};
