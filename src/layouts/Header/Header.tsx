"use client";
import style from "./Header.module.css";
import Link from "next/link";
import { useLoginState } from "../../context/LoginStateContext";
import { useEditMode } from "../../context/EditMovieContext";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
} as const;

interface HeaderProps {
  panelLogin: React.ReactNode;
}

// Header component that receives panelLogin as a prop
export const Header = React.memo(({ panelLogin }: HeaderProps) => {
  const { isLoggedIn, setIsLoggedIn } = useLoginState();
  const { isEditMode, toggleEditMode } = useEditMode();
  const [afterLoad, setAfterLoad] = useState(false);

  // Handle login/logout link click - memoized to prevent re-renders
  const handleLinkLogin = useCallback(() => {
    if (isLoggedIn) {
      setIsLoggedIn(!isLoggedIn);
    }
    if (isEditMode) {
      toggleEditMode();
    }
  }, [isLoggedIn, isEditMode, setIsLoggedIn, toggleEditMode]);
  useEffect(() => {
    const isFirstVisit = sessionStorage.getItem("headerAnimationShown") !== "true";

    if (isFirstVisit) {
      setAfterLoad(false);

      const timer = setTimeout(() => {
        setAfterLoad(true);
        sessionStorage.setItem("headerAnimationShown", "true");
      }, 500);
      // Clearing the timer on component unmount
      return () => clearTimeout(timer);
    } else {
      setAfterLoad(true);
    }
    // Empty dependency array - run only once on mount
  }, []);

  return (
    <header className={style.header} data-testid="main-header" style={afterLoad ? { top: 0 } : undefined}>
      <nav>
        <Link href="/" onClick={handleLinkLogin}>
          <Image src="/logo.png" alt="logo" width={113} height={45} priority={true} />
          <p>Good Family Movies</p>
        </Link>

        {/* Render login panel passed as prop */}
        {panelLogin}

        <Link href={isLoggedIn ? ROUTES.HOME : ROUTES.AUTH} onClick={handleLinkLogin}>
          <button className={style.button}> {isLoggedIn ? "Logout" : "Login"} </button>
        </Link>
      </nav>
    </header>
  );
});
Header.displayName = "Header";
