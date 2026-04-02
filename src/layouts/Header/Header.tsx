"use client";
import style from "./Header.module.css";
import Link from "next/link";
import { useLoginState } from "../../context/LoginStateContext";
import { useEditMode } from "../../context/EditMovieContext";
import Image from "next/image";
import React, { useCallback } from "react";

const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
} as const;

interface HeaderProps {
  panelLogin: React.ReactNode;
}

export const Header = React.memo(({ panelLogin }: HeaderProps) => {
  const { isLoggedIn, setIsLoggedIn } = useLoginState();
  const { isEditMode, toggleEditMode } = useEditMode();

  const handleLinkLogin = useCallback(() => {
    if (isLoggedIn) {
      setIsLoggedIn(!isLoggedIn);
    }
    if (isEditMode) {
      toggleEditMode();
    }
  }, [isLoggedIn, isEditMode, setIsLoggedIn, toggleEditMode]);

  return (
    <header className={style.header} data-testid="main-header" style={{ top: '0' }}>
      <nav>
        <Link href="/" onClick={handleLinkLogin}>
          <Image src="/logo.png" alt="logo" width={113} height={45} priority={true} />
          <p>Good Family Movies</p>
        </Link>

        {panelLogin}

        <Link href={isLoggedIn ? ROUTES.HOME : ROUTES.AUTH} onClick={handleLinkLogin}>
          <button className={style.button}> {isLoggedIn ? "Logout" : "Login"} </button>
        </Link>
      </nav>
    </header>
  );
});
Header.displayName = "Header";
