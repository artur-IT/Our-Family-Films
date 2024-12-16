"use client";
import { PanelLogin } from "@/layouts/PanelLogin/PanelLogin";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthPage({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/auth" && isLoggedIn) {
      router.push("/");
    }
  }, [pathname, router]);

  return <PanelLogin />;
}
