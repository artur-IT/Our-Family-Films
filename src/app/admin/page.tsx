"use client";
import { useEffect } from "react";
import { useEditMode } from "@/context/EditMovieContext";
import style from "@/app/admin/admin.module.css";

export default function AdminPanel() {
  const { isEditMode, toggleEditMode, toggleShowAddMovie } = useEditMode();

  useEffect(() => {
    toggleEditMode();
    // Tutaj później dodamy sprawdzanie autoryzacji
  }, []);
  return (
    <div className={style.adminPanel}>
      <span>Admin Panel</span>
      <button onClick={toggleShowAddMovie}>Dodaj film</button>
      <button onClick={toggleEditMode}>{isEditMode ? "Zakończ edycję" : "Edytuj filmy"}</button>
    </div>
  );
}
