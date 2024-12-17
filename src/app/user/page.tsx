"use client";
import { useEffect } from "react";
import { useEditMode } from "@/context/EditMovieContext";
import style from "./user.module.css";

export default function UserPanel() {
  const { isEditMode, toggleEditMode } = useEditMode();

  useEffect(() => {
    toggleEditMode();
    // Tutaj później dodamy sprawdzanie autoryzacji
  }, []);
  return (
    <div className={style.userPanel}>
      <span>User Panel</span>
      <button onClick={toggleEditMode}>{isEditMode ? "Zakończ edycję" : "Edytuj filmy"}</button>
    </div>
  );
}
