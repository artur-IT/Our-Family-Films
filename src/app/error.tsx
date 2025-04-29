"use client";
import ErrorPopup from "@/components/ErrorPopup/ErrorPopup";

export default function Error({ error }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorPopup message={error.message || "Wystąpił nieoczekiwany błąd."} />;
}
