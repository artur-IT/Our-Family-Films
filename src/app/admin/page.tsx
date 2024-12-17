"use client";
import { useEffect } from "react";
import { useEditMode } from "@/context/EditMovieContext";

export default function AdminPanel() {
  const { toggleEditMode } = useEditMode();

  useEffect(() => {
    toggleEditMode();
    // Tutaj później dodamy sprawdzanie autoryzacji
  }, []);
  return <></>;
}
