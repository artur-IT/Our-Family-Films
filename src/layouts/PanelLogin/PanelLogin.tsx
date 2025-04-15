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

const ANIMATION_DURATION = 500;
const ADMIN_USERNAME = "ar";
const ROUTES = {
  ADMIN: "/admin",
  USER: "/user",
  HOME: "/",
} as const;

export const PanelLogin = () => {
  // Custom hooks and state management
  const { checkUser } = useEditMode();
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn, users } = useLoginState();
  const { register, handleSubmit } = useForm();
  const [isAnimating, setIsAnimating] = useState(false);
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);

  // Handle form submission and user authentication
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // Find user in users array matching provided credentials
    const foundUser = users.find((user: User) => user.username === data.username && user.password === data.password);

    if (foundUser) {
      // If user found, update login state and set authentication cookie
      setIsLoggedIn(!isLoggedIn);
      checkUser(foundUser.name);
      document.cookie = "auth=true; path=/";
      setIsAnimating(false);

      // Redirect user based on their role after animation
      setTimeout(async () => {
        if (foundUser.username === ADMIN_USERNAME) {
          await router.push(ROUTES.ADMIN);
        } else {
          await router.push(ROUTES.USER);
        }
      }, ANIMATION_DURATION);
    } else {
      setError("Wrong user or password!");
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
      }, ANIMATION_DURATION); // Same duration as CSS transition
    }
  }, [pathname, router]);

  // Handle escape button click
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
      {/* Login form with form validation */}
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
