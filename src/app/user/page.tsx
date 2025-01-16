"use client";
import { useEffect } from "react";
import { useEditMode } from "@/context/EditMovieContext";
import style from "./user.module.css";
import { useLoginState } from "@/context/LoginStateContext";

export default function UserPanel() {
  const { isEditMode, toggleEditMode } = useEditMode();
  console.log(useLoginState);

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
