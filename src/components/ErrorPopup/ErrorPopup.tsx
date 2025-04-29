"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./ErrorPopup.module.css";

interface ErrorPopupProps {
  message: string;
  redirectPath?: string;
  redirectTime?: number;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, redirectPath = "/", redirectTime = 4000 }) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(redirectPath);
    }, redirectTime);

    return () => clearTimeout(timer);
  }, [router, redirectPath, redirectTime]);

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>Błąd</h2>
        <p>{message}</p>
        <p className={styles.redirectInfo}>Wracamy na stronę główną...</p>
      </div>
    </div>
  );
};

export default ErrorPopup;
