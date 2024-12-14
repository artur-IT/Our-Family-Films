"use client";
import { createPortal } from "react-dom";
import { PanelLogin } from "@/layouts/PanelLogin/PanelLogin";

export default function AuthPage() {
  // const test = createPortal(<PanelLogin />, document.getElementById("modal-root")!);
  return (
    <>
      {/* {test} */}
      <PanelLogin />
      <p>....</p>
      <h1>Z auth to jest</h1>
    </>
  );
}
