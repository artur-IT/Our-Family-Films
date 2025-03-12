"use client";
import style from "./Header.module.css";
import Link from "next/link";
import { useLoginState } from "../../context/LoginStateContext";
import { useEditMode } from "../../context/EditMovieContext";
import Image from "next/image";
import React from "react";

const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
} as const;

interface HeaderProps {
  panelLogin: React.ReactNode;
}

// Header component that receives panelLogin as a prop
export const Header = React.memo(({ panelLogin }: HeaderProps) => {
  // Get login state and edit mode from context hooks
  const { isLoggedIn, setIsLoggedIn } = useLoginState();
  const { isEditMode, toggleEditMode } = useEditMode();

  // Handle login/logout link click
  // If user is logged in, log them out
  // If edit mode is active, disable it
  const handleLinkLogin = () => {
    if (isLoggedIn) {
      setIsLoggedIn(!isLoggedIn);
    }
    if (isEditMode) {
      toggleEditMode();
    }
  };

  return (
    <>
      <header className={style.header} data-testid="main-header">
        <nav>
          {/* Logo and title link that also handles logout */}
          <Link href="/" onClick={handleLinkLogin}>
            <Image src="/logo.png" alt="logo" width={113} height={45} priority={true} />
            <p>Good Family Movies</p>
          </Link>

          {/* Render login panel passed as prop */}
          {panelLogin}

          {/* Dynamic login/logout button that changes based on login state */}
          <Link href={isLoggedIn ? ROUTES.HOME : ROUTES.AUTH} onClick={handleLinkLogin}>
            <button className={style.button}> {isLoggedIn ? "Logout" : "Login"} </button>
          </Link>
        </nav>
      </header>
    </>
  );
});
Header.displayName = "Header";
