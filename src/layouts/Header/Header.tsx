import style from "./Header.module.css";

export const Header = () => {
  return (
    <header className={style.header}>
      <nav>
        <p>Our Family Films</p>
        <a href="#">Zaloguj</a>
      </nav>
    </header>
  );
};
