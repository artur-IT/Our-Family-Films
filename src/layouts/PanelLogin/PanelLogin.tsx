import { usePathname, useRouter } from "next/navigation";
import styles from "./PanelLogin.module.css";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useLoginState } from "@/context/LoginStateContext";
import { useEditMode } from "@/context/EditMovieContext";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  username: string;
  password: string;
}
interface PanelLoginProps {
  isVisible: boolean;
}

export const PanelLogin = () => {
  const { checkUser } = useEditMode();
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn, users } = useLoginState();
  const { register, handleSubmit } = useForm();

  const [isAnimating, setIsAnimating] = useState(false);
  const pathname = usePathname();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const foundUser = users.find((user: User) => user.username === data.username && user.password === data.password);

    if (foundUser) {
      setIsLoggedIn(!isLoggedIn);
      checkUser(foundUser.name);
      document.cookie = "auth=true; path=/";

      if (foundUser.username === "ar") {
        await router.push("/admin");
      } else {
        await router.push("/user");
      }
    } else {
      alert("Nieprawidłowe dane logowania!");
    }
  };

  useEffect(() => {
    if (pathname === "/auth") {
      setIsAnimating(true);
    } else {
      // Dodajemy małe opóźnienie przed ukryciem panelu
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }
  }, [pathname]);

  return (
    <div className={`${styles.loginPanel} ${isAnimating ? styles.loginPanelShow : ""}`}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label>
            Username:
            <input type="text" id="username" autoComplete="yes" {...register("username", { required: true })} />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            Password:
            <input type="current-password" id="current-password" {...register("password", { required: true })} />
          </label>
        </div>
        <div className={styles.buttons}>
          <button type="submit" className={styles.button}>
            Login
          </button>
          <Link href="/">
            <button className={styles.button}>Esc</button>
          </Link>
        </div>
      </form>
    </div>
  );
};
