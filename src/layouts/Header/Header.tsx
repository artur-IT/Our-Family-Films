"use client";
import style from "./Header.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLoginState } from "@/context/LoginStateContext";
import { useEditMode } from "@/context/EditMovieContext";
import Image from "next/image";
import { PanelLogin } from "../PanelLogin/PanelLogin";
import { usePathname } from "next/navigation";

export const Header = ({}) => {
  const { isLoggedIn, setIsLoggedIn } = useLoginState();
  const { isEditMode, toggleEditMode } = useEditMode();

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
      <header className={style.header}>
        <nav>
          <Link href="/" onClick={handleLinkLogin}>
            <Image src="/logo.png" alt="logo" width={113} height={45} />
            <p>Our Family Films</p>
          </Link>

          <Link href={isLoggedIn ? "/" : "/auth"} onClick={handleLinkLogin}>
            <button className={style.button}> {isLoggedIn ? "Logout" : "Login"} </button>
          </Link>
        </nav>
      </header>
      <PanelLogin />
    </>
  );
};
