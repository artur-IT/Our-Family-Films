"use client";
import { usePathname } from "next/navigation";
import { useEditMode } from "@/context/EditMovieContext";
import style from "./Header.module.css";
import Link from "next/link";
import { useState } from "react";
import { useLoginState } from "@/context/LoginStateContext";
import AdminPanel from "@/app/admin/page";

export const Header = ({ setShowAddMovie }: { setShowAddMovie: () => void }) => {
  const { isEditMode } = useEditMode();
  const [showPanelLogin, setShowPanelLogin] = useState<boolean>(false);
  const { isLoggedIn, setIsLoggedIn } = useLoginState();
  const pathname = usePathname();

  const handleLinkLogin = () => {
    if (isLoggedIn) setIsLoggedIn(!isLoggedIn);
    setShowPanelLogin(!showPanelLogin);
  };

  return (
    <>
      <header className={style.header}>
        <nav>
          <p>Our Family Films</p>

          {pathname === "/admin" && isLoggedIn && <AdminPanel setShowAddMovie={setShowAddMovie} isEditMode={isEditMode} />}

          <Link href={showPanelLogin ? "/" : "/auth"} onClick={handleLinkLogin}>
            {isLoggedIn ? "Wyloguj" : "Zaloguj"}
          </Link>
        </nav>
      </header>
    </>
  );
};
