import { Movie } from "../Movie/Movie";
import style from "./Shelf.module.css";

export const Shelf = () => {
  return (
    <>
      <div className={style.shelf}>
        {/* <h2>Shelf</h2> */}
        <Movie />
        <Movie />
        <Movie />
      </div>
      <div className={style.shelf_bottom}></div>
    </>
  );
};
