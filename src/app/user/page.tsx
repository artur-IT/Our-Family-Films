"use client";
import { useEffect } from "react";
import { useEditMode } from "@/context/EditMovieContext";
import style from "./user.module.css";

export default function UserPanel() {
  const { isEditMode, user, toggleEditMode } = useEditMode();

  useEffect(() => {
    toggleEditMode();
  }, []);
  return (
    <div className={style.userPanel}>
      <span className={style.hallo}>Witaj {user}</span>
      <button onClick={toggleEditMode}>{isEditMode ? "Zakończ edycję" : "Edytuj filmy"}</button>
    </div>
  );
}
