"use client";
import { useEffect } from "react";
import { useEditMode } from "@/context/EditMovieContext";

interface PropsTypes {
  setShowAddMovie: () => void;
  isEditMode: boolean;
}

export default function AdminPanel({ setShowAddMovie, isEditMode }: PropsTypes) {
  const { toggleEditMode } = useEditMode();

  useEffect(() => {
    toggleEditMode();
    // Tutaj później dodamy sprawdzanie autoryzacji
  }, []);
  return (
    <>
      <button onClick={setShowAddMovie}>Dodaj film</button>
      <button onClick={toggleEditMode}>{isEditMode ? "Zakończ edycję" : "Edytuj filmy"}</button>
    </>
  );
}
