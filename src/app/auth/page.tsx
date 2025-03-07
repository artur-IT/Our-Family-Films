"use client";
import { PanelLogin } from "@/layouts/PanelLogin/PanelLogin";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useLoginState } from "@/context/LoginStateContext";

// This is the main component for the authentication page.
export default function AuthPage() {
  // useRouter is a hook that gives us access to the router object for navigation.
  const router = useRouter();
  // usePathname is a hook that returns the current pathname of the URL.
  const pathname = usePathname();
  // useLoginState is a custom hook that provides the login state of the user.
  const { isLoggedIn } = useLoginState();

  useEffect(() => {
    if (pathname === "/auth" && isLoggedIn) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router]);

  // Render the PanelLogin component for user authentication.
  return <PanelLogin />;
}
