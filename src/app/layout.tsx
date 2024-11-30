import type { Metadata } from "next";
import styles from "./layout.module.css";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "Our Family Films",
  description: "Nasze rodzinne filmy",
  icons: {
    apple: "/apple-touch-icon.png",
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
};

export default function RootLayout() {
  return (
    <html lang="pl">
      <body className={styles.main}>
        <ClientLayout />
      </body>
    </html>
  );
}
