"use client";
import { useEditMode } from "@/context/EditMovieContext";
import style from "./user.module.css";

export default function UserPanel() {
  const { isEditMode, user, toggleEditMode } = useEditMode();

  return (
    <div className={style.userPanel}>
      <span className={style.hallo}>Hi {user}</span>
      <button onClick={toggleEditMode}>{isEditMode ? "EDIT END" : "EDIT MOVIES"}</button>
    </div>
  );
}
