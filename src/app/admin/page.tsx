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
  return <></>;
}
