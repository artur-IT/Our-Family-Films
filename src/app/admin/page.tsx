"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { Movie } from "@/components/Movie/Movie";
import { useEditMode } from "@/context/EditMovieContext";
import style from "./admin.module.css";

export default function AdminPanel() {
  const router = useRouter();
  const { toggleEditMode } = useEditMode();

  useEffect(() => {
    toggleEditMode();
    // Tutaj później dodamy sprawdzanie autoryzacji
  }, []);
  return (
    <div className={style.adminPanel}>
      <h1>Panel Administratora</h1>
      <div className={style.adminControls}>
        <button onClick={() => router.push("/")}>Powrót do strony głównej</button>
      </div>
      {/* Tu dodamy listę filmów z możliwością edycji */}
    </div>
  );
}
