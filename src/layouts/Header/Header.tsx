"use client";
import style from "./Header.module.css";
import Link from "next/link";
import { useState } from "react";
import { useLoginState } from "@/context/LoginStateContext";
import { useEditMode } from "@/context/EditMovieContext";
import Image from "next/image";

export const Header = ({}) => {
  const [showPanelLogin, setShowPanelLogin] = useState<boolean>(false);
  const { isLoggedIn, setIsLoggedIn } = useLoginState();
  const { isEditMode, toggleEditMode } = useEditMode();

  const handleLinkLogin = () => {
    if (isLoggedIn) {
      setIsLoggedIn(!isLoggedIn);
    }
    if (isEditMode) {
      toggleEditMode();
    }
    setShowPanelLogin(!showPanelLogin);
  };

  return (
    <>
      <header className={style.header}>
        <nav>
          <Link href="/" onClick={handleLinkLogin}>
            <Image src="/logo.png" alt="logo" width={113} height={45} />
            <p>Our Family Films</p>
          </Link>

          <Link href={showPanelLogin ? "/" : "/auth"} onClick={handleLinkLogin}>
            <button className={style.button}> {isLoggedIn ? "Logout" : "Login"}</button>
          </Link>
        </nav>
      </header>
    </>
  );
};
