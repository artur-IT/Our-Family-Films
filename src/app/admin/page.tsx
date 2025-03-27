"use client";
import { useEditMode } from "@/context/EditMovieContext";
import style from "@/app/admin/admin.module.css";

export default function AdminPanel() {
  const { isEditMode, toggleEditMode, toggleShowAddMovie } = useEditMode();

  return (
    <div className={style.adminPanel}>
      <span>Admin Panel</span>

      <button className={style.buttons} onClick={toggleEditMode}>
        {isEditMode ? "EDIT END" : "EDIT MOVIE"}
      </button>

      <button
        className={style.buttons}
        onClick={toggleShowAddMovie}
        disabled={!isEditMode}
        style={{ visibility: isEditMode ? "visible" : "hidden" }}
      >
        ADD MOVIE
      </button>
    </div>
  );
}
