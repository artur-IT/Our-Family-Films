import { usePathname, useRouter } from "next/navigation";
import styles from "./PanelLogin.module.css";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useLoginState } from "@/context/LoginStateContext";
import { useEditMode } from "@/context/EditMovieContext";
import Link from "next/link";
import { useEffect, useState } from "react";

const ANIMATION_DURATION = 500;
const ADMIN_USERNAME = "ar";
const ROUTES = {
  ADMIN: "/admin",
  USER: "/user",
  HOME: "/",
} as const;

export const PanelLogin = () => {
  const { checkUser } = useEditMode();
  const router = useRouter();
  const { setIsLoggedIn } = useLoginState();
  const { register, handleSubmit } = useForm();
  const [isAnimating, setIsAnimating] = useState(false);
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);

  // Handle form submission and user authentication
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setError(null);

      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (result.success && result.user) {
        setIsLoggedIn(true);
        checkUser(result.user.name || result.user.username);
        document.cookie = "auth=true; path=/";
        setIsAnimating(false);

        setTimeout(async () => {
          if (result.user.username === ADMIN_USERNAME) {
            await router.push(ROUTES.ADMIN);
          } else {
            await router.push(ROUTES.USER);
          }
        }, ANIMATION_DURATION);
      } else {
        setError("Wrong user or password!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    }
  };

  // Handle animation states based on current route
  useEffect(() => {
    if (pathname === "/auth") {
      setIsAnimating(true);
    } else {
      // Start exit animation and redirect to home
      setIsAnimating(false);
      setTimeout(() => {
        router.push(ROUTES.HOME);
      }, ANIMATION_DURATION);
    }
  }, [pathname, router]);

  const handleEsc = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAnimating(false);
    // Wait for animation to complete before redirect
    setTimeout(() => {
      router.push(ROUTES.HOME);
    }, ANIMATION_DURATION);
  };

  return (
    <div className={`${styles.loginPanel} ${isAnimating ? styles.loginPanelShow : ""}`}>
      {error && <div className={styles.error}>{error}</div>}
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
            <input type="password" id="current-password" {...register("password", { required: true })} autoComplete="no" />
          </label>
        </div>
        <div className={styles.buttons}>
          <button type="submit" className={styles.button}>
            Login
          </button>
          <Link href={ROUTES.HOME}>
            <button className={styles.button} type="button" onClick={handleEsc}>
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};
