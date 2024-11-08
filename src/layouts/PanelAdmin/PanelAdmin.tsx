// import { Link } from "react-router-dom";
import style from "./PanelAdmin.module.css";

export const PanelAdmin = () => {
  const editMovie = (
    <div className={style.movie_data}>
      <input>Sweet Tooth</input>
      {/* <p>2021</p>
  <p>serial</p> */}
    </div>
  );

  const handleEdit = () => {
    return editMovie;
  };

  return (
    <div className={style.movie_description}>
      <button className={style.edit_btn} onClick={handleEdit}>
        Edytuj
      </button>
      <button className={style.delete_btn}>Usuń</button>
    </div>
  );
};
{
  /* <h1>PanelAdmin</h1> */
}
{
  /* <Link to="/">Back to main page</Link> */
}
