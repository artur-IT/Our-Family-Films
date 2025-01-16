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
          <p>Our Family Films</p>
          <Link href={showPanelLogin ? "/" : "/auth"} onClick={handleLinkLogin}>
            {isLoggedIn ? "Wyloguj" : "Zaloguj"}
          </Link>
        </nav>
      </header>
    </>
  );
};
