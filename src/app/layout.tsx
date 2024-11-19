import type { Metadata } from "next";
import { MovieProvider } from "@/context/MovieContext";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "Our Family Films",
  description: "Nasze rodzinne filmy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <MovieProvider>
        <body className={styles.main}>{children}</body>
      </MovieProvider>
    </html>
  );
}
