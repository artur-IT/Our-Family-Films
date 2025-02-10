"use client";
import { usePathname } from "next/navigation";
import style from "./Header.module.css";
import Link from "next/link";
import { useState } from "react";
import { useLoginState } from "@/context/LoginStateContext";

export const Header = ({}) => {
  const [showPanelLogin, setShowPanelLogin] = useState<boolean>(false);
  const { isLoggedIn, setIsLoggedIn } = useLoginState();

  const handleLinkLogin = () => {
    if (isLoggedIn) setIsLoggedIn(!isLoggedIn);
    setShowPanelLogin(!showPanelLogin);
  };

  return (
    <>
      <header className={style.header}>
        <nav>
          <Link href="/">
            <p>Our Family Films</p>
          </Link>

          <Link href={showPanelLogin ? "/" : "/auth"} onClick={handleLinkLogin}>
            <button className={style.button}> {isLoggedIn ? "Wyloguj" : "Zaloguj"}</button>
          </Link>
        </nav>
      </header>
    </>
  );
};
