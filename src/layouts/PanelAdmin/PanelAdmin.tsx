// import { Link } from "react-router-dom";
import style from "./PanelAdmin.module.css";

export const PanelAdmin = () => {
  return (
    <div>
      <h1>PanelAdmin</h1>
      {/* <Link to="/">Back to main page</Link> */}
      <div className={style.movie_description}>
        <button className={style.edit_btn}>Edytuj</button>
        <button className={style.delete_btn}>Usuń</button>
      </div>
    </div>
  );
};
