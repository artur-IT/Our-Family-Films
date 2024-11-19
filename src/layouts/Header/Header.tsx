import style from "./Header.module.css";

export const Header = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <header className={style.header}>
      <nav>
        <p>Our Family Films</p>
        <a href="#">Dodaj film</a>
        <a href="#" onClick={onLogin}>
          Zaloguj
        </a>
      </nav>
    </header>
  );
};
