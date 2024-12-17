"use client";
import { PanelLogin } from "@/layouts/PanelLogin/PanelLogin";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useLoginState } from "@/context/LoginStateContext";

export default function AuthPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, setIsLoggedIn } = useLoginState();

  useEffect(() => {
    if (pathname === "/auth" && isLoggedIn) {
      router.push("/");
    }
  }, [pathname, router]);

  return <PanelLogin />;
}
